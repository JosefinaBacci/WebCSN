import { Router } from "express";
import {
    register,
    getByEmail,
    getById,
    pending,
    approve,
    reject,
    approved
} from "../controllers/users.controller.js";

const router = Router();

router.post("/register", register);
router.get("/by-email/:email", getByEmail);
router.get("/by-id/:id", getById);
router.get("/pending", pending);
router.patch("/:id/approve", approve);
router.patch("/:id/reject", reject);
router.get("/approved", approved);

export default router;
