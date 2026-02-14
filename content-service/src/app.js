import express from "express";
import routes from "./routes/announcements.routes.js";

const app = express();
app.use(express.json());
app.use("/announcements", routes);

export default app;
