import amqp from "amqplib";

let channel;
let connection;
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

export async function initRabbit() {
    try {
        connection = await connectWithRetry();
        channel = await connection.createChannel();
        await channel.assertExchange("school.events", "topic", { durable: true });
        isConnected = true;
        console.log("RabbitMQ connected successfully");
        
        connection.on('error', (err) => {
            console.error("RabbitMQ connection error:", err.message);
            isConnected = false;
            setTimeout(() => {
                console.log("Attempting to reconnect to RabbitMQ...");
                initRabbit().catch(err => console.error("Reconnect failed:", err.message));
            }, 5000);
        });
        
        connection.on('close', () => {
            console.log("RabbitMQ connection closed");
            isConnected = false;
        });
        
    } catch (err) {
        console.error("Failed to initialize RabbitMQ:", err.message);
        throw err;
    }
}

export function publish(event, data) {
    if (!isConnected || !channel) {
        console.error("RabbitMQ channel not available, event lost:", event);
        return;
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