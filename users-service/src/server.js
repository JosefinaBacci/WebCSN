import dotenv from "dotenv";
import app from "./app.js";
import { connectMongo } from "./config/mongo.js";
import { createAdmin } from "./seed/admin.seed.js";
import { initRabbit } from "./rabbit/publisher.js";

dotenv.config();

app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function start() {
    try {
        await connectMongo(process.env.MONGO_URI);
        await createAdmin();
        await initRabbit();

        const server = app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
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


