import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { startConsumer } from "./rabbit/consumer.js";
import contactFormRoutes from "./routes/contactForm.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", contactFormRoutes);

const PORT = process.env.PORT || 4005;

app.listen(PORT, () => {
    console.log(`Notification service running on port ${PORT}`);
});

startConsumer().catch(console.error);
