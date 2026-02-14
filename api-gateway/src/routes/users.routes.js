import { Router } from "express";
import { register, approve, getPending } from "../services/users.service.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/register", async (req, res) => {
    const response = await register(req.body);
    res.json(response.data);
});

router.patch(
    "/:id/approve",
    authenticate,
    authorize("admin"),
    async (req, res) => {
        const response = await approve(req.params.id);
        res.json(response.data);
    }
);

router.get("/pending", authenticate, authorize("admin"), async (req, res) => {
    const response = await getPending(req.headers.authorization);
    res.json(response.data);
});

export default router;
