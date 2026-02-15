import dotenv from "dotenv";
import app from "./app.js";
import { connectMongo } from "./mongo.js";
import { startStorageConsumer } from "./consumer.js";

dotenv.config();

const PORT = process.env.PORT || 4004;

async function start() {
    await connectMongo(process.env.MONGO_URI);
    await startStorageConsumer(process.env.RABBIT_URL);

    app.listen(PORT, () => {
        console.log(`Storage service HTTP running on ${PORT}`);
    });
}

start();
