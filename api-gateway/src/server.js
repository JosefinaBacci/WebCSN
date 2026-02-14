import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

app.listen(process.env.PORT, () =>
    console.log(`API Gateway running on ${process.env.PORT}`)
);
