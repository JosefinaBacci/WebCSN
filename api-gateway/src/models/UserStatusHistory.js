import mongoose from "mongoose";

const UserStatusHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    email: {
        type: String,
        required: true
    },
    previousStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        required: true
    },
    newStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        required: true
    },
    changedBy: {
        type: String,
        required: true
    },
    reason: String,
    changedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model("UserStatusHistory", UserStatusHistorySchema);
