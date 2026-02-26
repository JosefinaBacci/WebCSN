import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {
    loginController,
    registerController,
    getPendingController,
    getApprovedController,
    getRejectedController,
    approveController,
    rejectController,
    getUserHistoryController,
    getAllHistoryController,
    updateUserStatusController,
    createAnnouncementController,
    getAnnouncementsController,
    getAnnouncementController,
    deleteAnnouncementController,
    contactFormController
} from "../controllers/unified.controller.js";

const router = Router();

// Auth routes
router.post("/auth/login", loginController);
router.post("/users/register", registerController);

// User management routes
router.get("/users/pending", authenticate, authorize("admin"), getPendingController);
router.get("/users/approved", authenticate, authorize("admin"), getApprovedController);
router.get("/users/rejected", authenticate, authorize("admin"), getRejectedController);

// User status history routes
router.get("/users/:id/history", authenticate, authorize("admin"), getUserHistoryController);
router.get("/users/admin/history-all", authenticate, authorize("admin"), getAllHistoryController);

// User status update routes
router.patch("/users/:id/approve", authenticate, authorize("admin"), approveController);
router.patch("/users/:id/reject", authenticate, authorize("admin"), rejectController);
router.patch("/users/:id/status", authenticate, authorize("admin"), updateUserStatusController);

// Announcements routes
router.post("/announcements", authenticate, authorize("admin"), createAnnouncementController);
router.get("/announcements", authenticate, getAnnouncementsController);
router.get("/announcements/:id", authenticate, getAnnouncementController);
router.delete("/announcements/:id", authenticate, authorize("admin"), deleteAnnouncementController);

// Contact form routes
router.post("/contact-form", contactFormController);
router.post("/notifications/contact-form", contactFormController);

export default router;
