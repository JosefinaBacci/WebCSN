import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import announcementRoutes from "./routes/announcements.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";

const app = express();

app.use(cors({
    origin: [
        "https://web-kbbos5wio-josefinabaccis-projects.vercel.app",
        "https://web-csn.vercel.app"
    ],
    credentials: true
}));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/", announcementRoutes); 

export default app;
