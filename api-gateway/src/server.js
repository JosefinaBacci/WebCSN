import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import amqp from "amqplib";
import app from "./app.js";
import { connectMongo } from "./config/mongo.js";
import { initRabbit as initRabbitPublisher } from "./rabbit/publisher.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/csn";
const RABBIT_URL = process.env.RABBIT_URL;

await connectMongo(MONGO_URI);
await initRabbitPublisher().catch(err => console.error("Error inicializando RabbitMQ publisher:", err.message));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "*",
        credentials: true
    }
});

async function connectWithRetry() {
    while (true) {
        try {
            console.log("Conectando a RabbitMQ");
            return await amqp.connect(RABBIT_URL);
        } catch (err) {
            console.error("Rabbit no disponible, reintentando en 5s...", err.message);
            await new Promise(res => setTimeout(res, 5000));
        }
    }
}

async function initRabbit() {
    if (!RABBIT_URL) {
        console.log("RABBIT_URL no configurada, se desactiva tiempo real");
        return;
    }

    try {
        const conn = await connectWithRetry();
        const channel = await conn.createChannel();
        await channel.assertExchange("school.events", "topic", { durable: true });

        const q = await channel.assertQueue("", { exclusive: true });
        await channel.bindQueue(q.queue, "school.events", "announcement.created");
        await channel.bindQueue(q.queue, "school.events", "user.registered");
        await channel.bindQueue(q.queue, "school.events", "user.approved");
        await channel.bindQueue(q.queue, "school.events", "user.rejected");

        channel.consume(q.queue, msg => {
            if (msg) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    const eventType = msg.fields.routingKey;

                    if (eventType === "announcement.created") {
                        io.emit("new-announcement", content.data);
                    } else if (eventType === "user.registered") {
                        io.emit("new-pending-user", content.data);
                    } else if (eventType === "user.approved") {
                        io.emit("user-approved", content.data);
                    } else if (eventType === "user.rejected") {
                        io.emit("user-rejected", content.data);
                    }
                } catch (err) {
                    console.error("Error procesando mensaje de RabbitMQ:", err.message);
                }

                channel.ack(msg);
            }
        });
    } catch (err) {
        console.error("Error inicializando RabbitMQ:", err.message);
    }
}

initRabbit().catch(err => console.error("Error en initRabbit:", err.message));

server.listen(PORT, () =>
    console.log(`Unified Backend (HTTP + WS) running on port ${PORT}`)
);

