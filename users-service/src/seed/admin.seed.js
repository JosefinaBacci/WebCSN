import bcrypt from "bcrypt";
import User from "../models/User.js";

export async function createAdmin() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@school.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        await User.deleteOne({ email: adminEmail });

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await User.create({
            role: "admin",
            email: adminEmail,
            password: hashedPassword,
            status: "approved"
        });

        console.log(`Admin created: ${adminEmail}`);
    } catch (error) {
        console.error("Error creating admin:", error.message);
    }
}
