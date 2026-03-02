import amqp from "amqplib";
import Announcement from "./models/Announcement.js";

let connection;
let channel;
let isConnected = false;

async function connectWithRetry(maxRetries = 10) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            console.log(`Conectando a RabbitMQ... (intento ${retries + 1}/${maxRetries})`);
            return await amqp.connect(process.env.RABBIT_URL);
        } catch (err) {
            retries++;
            const delay = Math.min(5000 * Math.pow(2, retries), 60000);
            console.error(`RabbitMQ no disponible, reintentando en ${delay}ms...`, err.message);
            await new Promise(res => setTimeout(res, delay));
        }
    }
    throw new Error("Failed to connect to RabbitMQ after maximum retries");
}

export async function startStorageConsumer(rabbitUrl) {
    try {
        connection = await connectWithRetry();
        channel = await connection.createChannel();
        isConnected = true;

        await channel.assertExchange("school.events", "topic", { durable: true });

        const q = await channel.assertQueue("announcements.storage", { durable: true });
        await channel.bindQueue(q.queue, "school.events", "announcement.created");

        console.log("Storage service waiting for announcements...");

        channel.consume(q.queue, async (msg) => {
            if (!msg) return;

            const payload = JSON.parse(msg.content.toString());

            if (!payload || payload.event !== "announcement.created" || !payload.data) {
                console.warn("Invalid announcement payload:", payload);
                channel.ack(msg);
                return;
            }

            const data = payload.data;

            try {
                await Announcement.create({
                    announcementId: data.id,
                    title: data.title,
                    content: data.content,
                    grade: data.grade,
                    createdAt: new Date(data.createdAt),
                    authorId: data.authorId,
                });

                console.log("Announcement stored:", data.title);
                channel.ack(msg);
            } catch (err) {
                console.error("Error storing announcement:", err.message);
                channel.nack(msg, false, true); 
            }
        });

        connection.on('error', (err) => {
            console.error("RabbitMQ connection error:", err.message);
            isConnected = false;
            setTimeout(() => {
                console.log("Attempting to reconnect to RabbitMQ...");
                startStorageConsumer(rabbitUrl).catch(err => console.error("Reconnect failed:", err.message));
            }, 5000);
        });

        connection.on('close', () => {
            console.log("RabbitMQ connection closed");
            isConnected = false;
        });

    } catch (err) {
        console.error("Failed to initialize Storage Consumer:", err.message);
        throw err;
    }
}
