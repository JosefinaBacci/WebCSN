import bcrypt from "bcrypt";
import User from "../models/User.js";
import UserStatusHistory from "../models/UserStatusHistory.js";
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
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const previousStatus = user.status;
        
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
        
        // Registrar en historial
        await UserStatusHistory.create({
            userId: req.params.id,
            email: user.email,
            previousStatus: previousStatus,
            newStatus: "approved",
            changedBy: req.user?.email || "admin",
            reason: req.body?.reason || undefined
        });

        publish("user.approved", req.params.id);
        res.json({ message: "User approved" });
    } catch (error) {
        console.error("APPROVE ERROR:", error);
        res.status(500).json({ message: "Error al aprobar usuario" });
    }
}

export async function reject(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const previousStatus = user.status;
        
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
        
        // Registrar en historial
        await UserStatusHistory.create({
            userId: req.params.id,
            email: user.email,
            previousStatus: previousStatus,
            newStatus: "rejected",
            changedBy: req.user?.email || "admin",
            reason: req.body?.reason || undefined
        });

        publish("user.rejected", req.params.id);
        res.json({ message: "User rejected" });
    } catch (error) {
        console.error("REJECT ERROR:", error);
        res.status(500).json({ message: "Error al rechazar usuario" });
    }
}

export async function approved(req, res) {
    const users = await User.find(
        { status: "approved" },
        { email: 1, role: 1 } 
    );
    res.json(users);
}

export async function getUserStatusHistory(req, res) {
    try {
        const history = await UserStatusHistory.find({ userId: req.params.id })
            .sort({ changedAt: -1 });
        res.json(history);
    } catch (error) {
        console.error("GET HISTORY ERROR:", error);
        res.status(500).json({ message: "Error al obtener historial" });
    }
}

export async function getAllStatusHistory(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [history, total] = await Promise.all([
            UserStatusHistory.find()
                .sort({ changedAt: -1 })
                .skip(skip)
                .limit(limit),
            UserStatusHistory.countDocuments()
        ]);

        res.json({
            data: history,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                totalItems: total
            }
        });
    } catch (error) {
        console.error("GET ALL HISTORY ERROR:", error);
        res.status(500).json({ message: "Error al obtener historial" });
    }
}

export async function rejected(req, res) {
    try {
        const users = await User.find({ status: "rejected" });
        res.json(users);
    } catch (error) {
        console.error("GET REJECTED ERROR:", error);
        res.status(500).json({ message: "Error al obtener usuarios rechazados" });
    }
}

export async function updateUserStatus(req, res) {
    try {
        const { newStatus, reason } = req.body;
        
        if (!["pending", "approved", "rejected"].includes(newStatus)) {
            return res.status(400).json({ message: "Estado inválido" });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const previousStatus = user.status;

        if (previousStatus === newStatus) {
            return res.status(400).json({ message: "El nuevo estado es igual al anterior" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { status: newStatus }, 
            { new: true }
        );

        await UserStatusHistory.create({
            userId: req.params.id,
            email: user.email,
            previousStatus: previousStatus,
            newStatus: newStatus,
            changedBy: req.user?.email || "admin",
            reason: reason || undefined
        });

        if (newStatus === "approved") {
            publish("user.approved", req.params.id);
        } else if (newStatus === "rejected") {
            publish("user.rejected", req.params.id);
        }

        res.json({ message: `User status updated to ${newStatus}`, user: updatedUser });
    } catch (error) {
        console.error("UPDATE STATUS ERROR:", error);
        res.status(500).json({ message: "Error al actualizar estado del usuario" });
    }
}


