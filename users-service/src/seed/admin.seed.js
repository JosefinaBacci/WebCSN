import bcrypt from "bcrypt";
import User from "../models/User.js";

export async function createAdmin() {
    const exists = await User.findOne({ role: "admin" });
    if (exists) return;

    const password = await bcrypt.hash("admin123", 10);

    await User.create({
        role: "admin",
        email: "admin@school.com",
        password,
        status: "approved"
    });

    console.log("Admin created");
}
