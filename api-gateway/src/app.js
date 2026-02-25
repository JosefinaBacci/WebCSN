import express from "express";
import cors from "cors";
import unifiedRoutes from "./routes/unified.routes.js";

const app = express();

app.use(cors({
    origin: [
        process.env.FRONTEND_URL
    ],
    credentials: true
}));
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/", unifiedRoutes);

export default app;
