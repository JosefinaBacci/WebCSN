import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
    announcementId: {
        type: String,
        required: true,
        unique: true
    },
    title: String,
    content: String,
    createdAt: Date,
    authorId: String
});

export default mongoose.model("Announcement", AnnouncementSchema);
