import amqp from "amqplib";
import axios from "axios";
import { transporter } from "../mail/mailer.js";

async function connectWithRetry() {
    while (true) {
        try {
            console.log("Conectando a RabbitMQ");
            return await amqp.connect(process.env.RABBIT_URL);
        } catch (err) {
            console.error("Rabbit no disponible, reintentando en 5s...", err);
            await new Promise(res => setTimeout(res, 5000));
        }
    }
}

export async function startConsumer() {
    const connection = await connectWithRetry();
    const channel = await connection.createChannel();

    const exchange = "school.events";
    await channel.assertExchange(exchange, "topic", { durable: true });

    const q = await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(q.queue, exchange, "announcement.created");

    console.log("Notification service waiting for announcements...");

    channel.consume(q.queue, async (msg) => {
        if (!msg) return;

        const payload = JSON.parse(msg.content.toString());
        if (!payload || payload.event !== "announcement.created" || !payload.data) {
            console.warn("Invalid announcement payload", payload);
            channel.ack(msg);
            return;
        }

        const announcement = payload.data;

        console.log("New announcement received:", announcement.title);

        const usersResponse = await axios.get(
        "http://users-service:4002/users/approved"
        );

        const users = usersResponse.data;

        for (const user of users) {
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
        }

        channel.ack(msg);
    });
}

