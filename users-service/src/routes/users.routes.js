import { Router } from "express";
import {
    register,
    getByEmail,
    getById,
    pending,
    approve,
    reject,
    approved,
    rejected,
    getUserStatusHistory,
    getAllStatusHistory,
    updateUserStatus
} from "../controllers/users.controller.js";

const router = Router();

router.post("/register", register);
router.get("/by-email/:email", getByEmail);
router.get("/by-id/:id", getById);
router.get("/pending", pending);
router.get("/approved", approved);
router.get("/rejected", rejected);

// Historial de cambios de estado
router.get("/:id/history", getUserStatusHistory);
router.get("/admin/history-all", getAllStatusHistory);

// Actualizar estado de usuario
router.patch("/:id/approve", approve);
router.patch("/:id/reject", reject);
router.patch("/:id/status", updateUserStatus);

export default router;
