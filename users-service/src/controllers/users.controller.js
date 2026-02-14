import bcrypt from "bcrypt";
import User from "../models/User.js";
import { publish } from "../rabbit/publisher.js";

export async function register(req, res) {
    try{
        const { role, email, password, profile } = req.body;

        const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({
                    message: "Ya existe un usuario registrado con ese email"
                });
            }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            role,
            email,
            password: hashed,
            profile
        });

        publish("user.registered", user);

        res.status(201).json({ message: "User registered", id: user._id });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Ya existe un usuario registrado con ese email"
            });
        }

        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}

export async function getByEmail(req, res) {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).end();
    res.json(user);
}

export async function getById(req, res) {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).end();
    res.json(user);
}

export async function pending(req, res) {
    const users = await User.find({ status: "pending" });
    res.json(users);
}

export async function approve(req, res) {
    const user = await User.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    publish("user.approved", req.params.id);
    res.json({ message: "User approved" });
}

export async function reject(req, res) {
    const user = await User.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    publish("user.rejected", req.params.id);
    res.json({ message: "User rejected" });
}

export async function approved(req, res) {
    const users = await User.find(
        { status: "approved" },
        { email: 1, role: 1 } 
    );
    res.json(users);
}

