import mongoose from "mongoose";

export async function connectMongo(uri) {
    try {
        await mongoose.connect(uri, {
            retryWrites: true,
            w: 'majority',
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("Storage service connected to MongoDB"); 
        
    } catch (err) {
        console.error("Mongo connection error", err.message);
        process.exit(1);
    }
}
