import dotenv from "dotenv";
import app from "./app.js";
import { initRabbit } from "./rabbit/publisher.js";

dotenv.config();

app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function start() {
    try {
        await initRabbit(); 

        const server = app.listen(process.env.PORT, () => {
            console.log(`Content service running on ${process.env.PORT}`);
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
