import mongoose from "mongoose";

const ChildSchema = new mongoose.Schema({
    name: String,
    grade: String
    });

    const UserSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["admin", "parent", "teacher"],
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

    profile: {
        name: String,
        lastname: String,
        children: [ChildSchema]
    }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
