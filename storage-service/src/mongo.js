import mongoose from "mongoose";

export async function connectMongo(uri) {
    try {
        await mongoose.connect(uri);
        console.log("Storage service connected to MongoDB");
    } catch (err) {
        console.error("Mongo connection error", err);
        process.exit(1);
    }
}
