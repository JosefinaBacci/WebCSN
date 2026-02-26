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
        
        setInterval(async () => {
            try {
                await mongoose.connection.db.admin().ping();
                console.log("MongoDB ping successful");
            } catch (err) {
                console.error("MongoDB ping failed, attempting reconnect:", err.message);
                await mongoose.connect(uri, {
                    retryWrites: true,
                    w: 'majority',
                });
            }
        }, 120000); 
        
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
}
