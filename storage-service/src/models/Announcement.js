import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
    announcementId: {
        type: String,
        required: true,
        unique: true
    },
    title: String,
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: function() {
            const date = new Date();
            date.setDate(date.getDate() + 14);
            return date;
        }
    },
    authorId: String
});

AnnouncementSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Announcement", AnnouncementSchema);
