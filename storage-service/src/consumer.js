import amqp from "amqplib";
import Announcement from "./models/Announcement.js";

async function connectWithRetry() {
    while (true) {
        try {
            console.log("Conectando a RabbitMQ...");
            return await amqp.connect(process.env.RABBIT_URL);
        } catch (err) {
            console.error("Rabbit no disponible, reintentando en 5s...", err);
            await new Promise(res => setTimeout(res, 5000));
        }
    }
}

export async function startStorageConsumer(rabbitUrl) {
    const conn = await connectWithRetry();
    const ch = await conn.createChannel();

    await ch.assertExchange("school.events", "topic", { durable: true });

    const q = await ch.assertQueue("announcements.storage", { durable: true });
    await ch.bindQueue(q.queue, "school.events", "announcement.created");

    console.log("Storage service waiting for announcements...");

    ch.consume(q.queue, async (msg) => {
        if (!msg) return;

        const payload = JSON.parse(msg.content.toString());

        if (!payload || payload.event !== "announcement.created" || !payload.data) {
            console.warn("Invalid announcement payload:", payload);
            ch.ack(msg);
            return;
        }

        const data = payload.data;

        await Announcement.create({
        announcementId: data.id,
        title: data.title,
        content: data.content,
        createdAt: new Date(data.createdAt),
        authorId: data.authorId,
        });

        console.log("Announcement stored:", data.title);

        ch.ack(msg);
    });
}
