import { Router } from "express";
import { login } from "../services/auth.service.js";

const router = Router();

router.post("/login", async (req, res) => {
    try {
        const response = await login(req.body);
        res.json(response.data);
    } catch (err) {
        console.error("Error en login:", {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            code: err.code
        });
        
        if (err.code === 'ECONNABORTED') {
            return res.status(504).json({ message: "Timeout: El servicio de auth no respondió" });
        }
        if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
            return res.status(503).json({ message: "El servicio de autenticación no está disponible" });
        }
        
        res.status(err.response?.status || 500).json({ message: err.response?.data?.message || "Error en login" });
    }
});

export default router;