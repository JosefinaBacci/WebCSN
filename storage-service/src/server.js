import dotenv from "dotenv";
import app from "./app.js";
import { connectMongo } from "./mongo.js";
import { startStorageConsumer } from "./consumer.js";

dotenv.config();

async function start() {
    await connectMongo(process.env.MONGO_URI);
    await startStorageConsumer(process.env.RABBIT_URL);

    app.listen(4004, () => {
        console.log("Storage service HTTP running on 4004");
    });
}

start();
