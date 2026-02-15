import { Router } from "express";
import { login } from "../services/auth.service.js";

const router = Router();

router.post("/login", async (req, res) => {
    try {
        const response = await login(req.body);
        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ message: "Error en login" });
    }
});

export default router;