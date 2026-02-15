import bcrypt from "bcrypt";
import User from "../models/User.js";

export async function registerUser({ email, password, role = "user" }) {
    const exists = await User.findOne({ email });
    if (exists) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPassword, 
        role,
        status: "approved"
    });

    return user;
}