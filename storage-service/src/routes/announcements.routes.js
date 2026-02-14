import { Router } from "express";
import Announcement from "../models/Announcement.js";

const router = Router();

router.get("/announcements", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [announcements, total] = await Promise.all([
        Announcement.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
        Announcement.countDocuments()
    ]);

    res.json({
        data: announcements,
        pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total
        }
    });
});


router.get("/announcements/:id", async (req, res) => {
    const announcement = await Announcement.findOne({
        announcementId: req.params.id
    });

    if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
    }

    res.json(announcement);
});

export default router;
