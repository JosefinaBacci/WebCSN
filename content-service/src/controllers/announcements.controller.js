import { v4 as uuid } from "uuid";
import { publish } from "../rabbit/publisher.js";

export async function create(req, res) {
    const { title, content } = req.body;

    const authorId = req.headers["x-user-id"];

    if (!authorId) {
        return res.status(401).json({ message: "Missing user context" });
    }

    const announcement = {
        id: uuid(),
        title,
        content,
        createdAt: new Date().toISOString(),
        authorId
    };

    publish("announcement.created", announcement);

    res.status(201).json({ message: "Announcement published", id: announcement.id });
}
