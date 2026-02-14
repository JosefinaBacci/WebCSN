import express from "express";
import announcementsRoutes from "./routes/announcements.routes.js";

const app = express();

app.use(express.json());
app.use(announcementsRoutes);

export default app;
