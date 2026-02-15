import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { proxyToContentService } from "../proxy/proxy.js";
import axios from "axios";


const STORAGE_SERVICE_URL = process.env.STORAGE_SERVICE_URL;

if (!STORAGE_SERVICE_URL) {
    console.error("ERROR: STORAGE_SERVICE_URL no está configurada");
}

const router = Router();

router.post(
    "/announcements",
    authenticate,
    authorize("admin"),
    proxyToContentService
);

router.get(
    "/announcements",
    authenticate,
    async (req, res) => {
        try {
            if (!STORAGE_SERVICE_URL) {
                return res.status(503).json({ message: "Storage service not configured" });
            }
            const response = await axios.get(
                `${STORAGE_SERVICE_URL}/announcements`,
                { params: req.query, timeout: 10000 }
            );
            res.json(response.data);
        } catch (error) {
            console.error("Get announcements error:", error.message);
            res.status(error.response?.status || 503).json({ 
                message: error.response?.data?.message || "Failed to get announcements" 
            });
        }
    }
);

router.get(
    "/announcements/:id",
    authenticate,
    async (req, res) => {
        try {
            if (!STORAGE_SERVICE_URL) {
                return res.status(503).json({ message: "Storage service not configured" });
            }
            const response = await axios.get(
                `${STORAGE_SERVICE_URL}/announcements/${req.params.id}`,
                { timeout: 10000 }
            );
            res.json(response.data);
        } catch (error) {
            console.error("Get announcement error:", error.message);
            res.status(error.response?.status || 503).json({ 
                message: error.response?.data?.message || "Failed to get announcement" 
            });
        }
    }
);


export default router;
