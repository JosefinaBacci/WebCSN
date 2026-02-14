import dotenv from "dotenv";
import app from "./app.js";
import { initRabbit } from "./rabbit/publisher.js";

dotenv.config();

async function start() {
    await initRabbit(); 

    app.listen(process.env.PORT, () => {
        console.log(`Content service running on ${process.env.PORT}`);
    });
}

start();
