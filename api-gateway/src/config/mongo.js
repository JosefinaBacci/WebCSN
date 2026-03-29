import mongoose from "mongoose";

export async function connectMongo(uri) {
    try {
        await mongoose.connect(uri, {
            retryWrites: true,
            w: 'majority',
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB connected"); 
        
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
}
