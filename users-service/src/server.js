import dotenv from "dotenv";
import app from "./app.js";
import { connectMongo } from "./config/mongo.js";
import { createAdmin } from "./seed/admin.seed.js";
import { initRabbit } from "./rabbit/publisher.js";

dotenv.config();

async function start() {
    await connectMongo(process.env.MONGO_URI);
    await createAdmin();
    await initRabbit();

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}

start();


