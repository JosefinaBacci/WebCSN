import { Router } from "express";
import axios from "axios";

const router = Router();

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL 

router.post("/contact-form", async (req, res) => {
    try {
        const response = await axios.post(
            `${NOTIFICATION_SERVICE_URL}/contact-form`,
            req.body
        );

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("Notification error:", error.message);

        res.status(
            error.response?.status || 500
        ).json({ message: "Error enviando formulario" });
    }
});

export default router;
