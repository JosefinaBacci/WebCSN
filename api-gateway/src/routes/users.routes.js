import { Router } from "express";
import { 
    register, 
    approve, 
    getPending, 
    reject,
    getApproved,
    getRejected,
    getUserStatusHistory,
    getAllStatusHistory,
    updateUserStatus
} from "../services/users.service.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/register", async (req, res) => {
    const response = await register(req.body);
    res.json(response.data);
});

router.get("/pending", authenticate, authorize("admin"), async (req, res) => {
    const response = await getPending(req.headers.authorization);
    res.json(response.data);
});

router.get("/approved", authenticate, authorize("admin"), async (req, res) => {
    const response = await getApproved(req.headers.authorization);
    res.json(response.data);
});

router.get("/rejected", authenticate, authorize("admin"), async (req, res) => {
    const response = await getRejected(req.headers.authorization);
    res.json(response.data);
});

router.get("/admin/history-all", authenticate, authorize("admin"), async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const response = await getAllStatusHistory(req.headers.authorization, page, limit);
    res.json(response.data);
});

router.get("/:id/history", authenticate, authorize("admin"), async (req, res) => {
    const response = await getUserStatusHistory(req.params.id, req.headers.authorization);
    res.json(response.data);
});

router.patch(
    "/:id/approve",
    authenticate,
    authorize("admin"),
    async (req, res) => {
        const response = await approve(req.params.id, req.headers.authorization);
        res.json(response.data);
    }
);

router.patch(
    "/:id/reject",
    authenticate,
    authorize("admin"),
    async (req, res) => {
        const response = await reject(req.params.id, req.headers.authorization);
        res.json(response.data);
    }
);

router.patch(
    "/:id/status",
    authenticate,
    authorize("admin"),
    async (req, res) => {
        const response = await updateUserStatus(req.params.id, req.body, req.headers.authorization);
        res.json(response.data);
    }
);

export default router;
