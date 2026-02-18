import amqp from "amqplib";
import axios from "axios";
import { transporter } from "../mail/resend.js";

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

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

export async function startConsumer() {
    try {
        connection = await connectWithRetry();
        channel = await connection.createChannel();
        isConnected = true;

        const exchange = "school.events";
        await channel.assertExchange(exchange, "topic", { durable: true });

        const q = await channel.assertQueue("", { exclusive: true });
        await channel.bindQueue(q.queue, exchange, "announcement.created");

        console.log("Notification service waiting for announcements...");

        channel.consume(q.queue, async (msg) => {
            if (!msg) return;

            try {
                const payload = JSON.parse(msg.content.toString());
                if (!payload || payload.event !== "announcement.created" || !payload.data) {
                    console.warn("Invalid announcement payload", payload);
                    channel.ack(msg);
                    return;
                }

                const announcement = payload.data;

                console.log("New announcement received:", announcement.title);

                const usersResponse = await axios.get(
                    `${USERS_SERVICE_URL}/users/approved`,
                    { timeout: 10000 }
                );

                const users = usersResponse.data;

                for (const user of users) {
                    try {
                        await transporter.sendMail({
                            from: '"Colegio Nuevo Sol" <colegionuevosolzapala@gmail.com>',
                            to: user.email,
                            subject: `📢 Nuevo comunicado: ${announcement.title}`,
                            html: `
                            <h2>${announcement.title}</h2>
                            <p>${announcement.content}</p>
                            <p>Fecha: ${new Date(announcement.createdAt).toLocaleDateString()}</p>
                            <hr />
                            `,
                        });
                    } catch (emailErr) {
                        console.error(`Failed to send email to ${user.email}:`, emailErr.message);
                    }
                }

                channel.ack(msg);
            } catch (err) {
                console.error("Error processing announcement:", err.message);
                channel.nack(msg, false, true); 
            }
        });
        
        connection.on('error', (err) => {
            console.error("RabbitMQ connection error:", err.message);
            isConnected = false;
            setTimeout(() => {
                console.log("Attempting to reconnect to RabbitMQ...");
                startConsumer().catch(err => console.error("Reconnect failed:", err.message));
            }, 5000);
        });

        connection.on('close', () => {
            console.log("RabbitMQ connection closed");
            isConnected = false;
        });

    } catch (err) {
        console.error("Failed to initialize Notification Consumer:", err.message);
        throw err;
    }
}

