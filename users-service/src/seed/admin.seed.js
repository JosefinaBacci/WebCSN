import bcrypt from "bcrypt";
import User from "../models/User.js";

export async function createAdmin() {
    try {
        await User.deleteOne({ email: "admin@school.com" });

        const password = await bcrypt.hash("admin123", 10);

        await User.create({
            role: "admin",
            email: "admin@school.com",
            password,
            status: "approved"
        });

        console.log("Admin created with hashed password");
    } catch (error) {
        console.error("Error creating admin:", error.message);
    }
}
