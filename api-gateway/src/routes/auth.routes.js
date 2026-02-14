import { Router } from "express";
import { login } from "../services/auth.service.js";

const router = Router();

router.post("/login", async (req, res) => {
    const response = await login(req.body);
    res.json(response.data);
});

export default router;
