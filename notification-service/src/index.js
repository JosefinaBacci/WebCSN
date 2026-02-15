import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { startConsumer } from "./rabbit/consumer.js";
import contactFormRoutes from "./routes/contactForm.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/", contactFormRoutes);

const PORT = process.env.PORT || 4005;

const server = app.listen(PORT, () => {
    console.log(`Notification service running on port ${PORT}`);
});

startConsumer().catch(console.error);

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
