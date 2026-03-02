import { v4 as uuid } from "uuid";
import { publish } from "../rabbit/publisher.js";

export async function create(req, res) {
    try {
        const { title, content, grade } = req.body;

        const authorId = req.headers["x-user-id"];

        if (!authorId) {
            return res.status(401).json({ message: "Missing user context" });
        }

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const announcement = {
            id: uuid(),
            title,
            content,
            grade: grade || undefined,
            createdAt: new Date().toISOString(),
            authorId
        };

        publish("announcement.created", announcement);

        res.status(201).json({ message: "Announcement published", id: announcement.id });
    } catch (error) {
        console.error("Create announcement error:", error);
        res.status(500).json({ message: "Failed to create announcement", error: error.message });
    }
}
