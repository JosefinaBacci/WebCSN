import amqp from "amqplib";

let channel;

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

export async function initRabbit() {
    const conn = await connectWithRetry();
    channel = await conn.createChannel();
    await channel.assertExchange("school.events", "topic", { durable: true });
}

export function publish(event, data) {
    if (!channel) {
        throw new Error("RabbitMQ channel not initialized");
    }
    
    try {
        channel.publish(
            "school.events",
            event,
            Buffer.from(
            JSON.stringify({
                event,
                data
            })
            )
        );
    } catch (error) {
        console.error("Error publishing to RabbitMQ:", error);
        throw error;
    }
}