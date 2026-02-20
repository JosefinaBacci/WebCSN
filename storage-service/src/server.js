import dotenv from "dotenv";
import app from "./app.js";
import { connectMongo } from "./mongo.js";
import { startStorageConsumer } from "./consumer.js";
import { startAnnouncementCleanup } from "./cleanup.js";

dotenv.config();

app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4004;

async function start() {
    try {
        await connectMongo(process.env.MONGO_URI);
        await startStorageConsumer(process.env.RABBIT_URL);
        await startAnnouncementCleanup();

        const server = app.listen(PORT, () => {
            console.log(`Storage service HTTP running on ${PORT}`);
        });
        
        process.on('SIGTERM', () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
                process.exit(0);
            });
        });
    } catch (err) {
        console.error("Failed to start server:", err.message);
        process.exit(1);
    }
}

start();
