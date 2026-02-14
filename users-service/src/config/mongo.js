import mongoose from "mongoose";

export async function connectMongo(uri) {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
