import { Server } from "socket.io";
import amqp from "amqplib";

const io = new Server(3001, { cors: { origin: "*" } }); 

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

async function initRabbit() {
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
            channel.ack(msg);
        }
    });
}

initRabbit();
