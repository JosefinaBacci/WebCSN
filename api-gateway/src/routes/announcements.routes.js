import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { proxyToContentService } from "../proxy/proxy.js";
import axios from "axios";

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
        const response = await axios.get(
        "http://storage-service:4004/announcements",
        { params: req.query }
        );
        res.json(response.data);
    }
);

router.get(
    "/announcements/:id",
    authenticate,
    async (req, res) => {
        const response = await axios.get(
        `http://storage-service:4004/announcements/${req.params.id}`
        );
        res.json(response.data);
    }
);


export default router;
