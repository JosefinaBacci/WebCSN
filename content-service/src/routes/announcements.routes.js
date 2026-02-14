import { Router } from "express";
import { create } from "../controllers/announcements.controller.js";

const router = Router();

router.post("/", create);

export default router;
