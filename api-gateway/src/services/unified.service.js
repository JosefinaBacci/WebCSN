import User from "../models/User.js";
import UserStatusHistory from "../models/UserStatusHistory.js";
import Announcement from "../models/Announcement.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { v4 as uuid } from "uuid";
import { publish } from "../rabbit/publisher.js";

export async function login(email, password) {
    try {
        const user = await User.findOne({ email });

        if (!user)
            return { error: "Invalid credentials", status: 401 };

        if (user.status !== "approved")
            return { error: "User not approved", status: 403 };

        const valid = await comparePassword(password, user.password);

        if (!valid)
            return { error: "Invalid credentials", status: 401 };

        const token = signToken({
            sub: user._id,
            role: user.role
        });

        return { token, role: user.role, status: 200 };
    } catch (error) {
        console.error("Login error:", error);
        return { error: "Login failed", status: 500 };
    }
}

export async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email });
        if (!user) return null;
        return user;
    } catch (error) {
        console.error("GetByEmail error:", error);
        throw error;
    }
}

export async function getUserById(id) {
    try {
        const user = await User.findById(id);
        if (!user) return null;
        return user;
    } catch (error) {
        console.error("GetById error:", error);
        throw error;
    }
}

export async function registerUser(userData) {
    try {
        const { role, email, password, profile } = userData;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: "Email already registered", status: 409 };
        }

        const hashed = await hashPassword(password);

        const user = await User.create({
            role,
            email,
            password: hashed,
            profile
        });

        return { user, status: 201 };
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return { error: "Registration failed", status: 500 };
    }
}

export async function getPendingUsers() {
    try {
        const users = await User.find({ status: "pending" });
        return users;
    } catch (error) {
        console.error("GET PENDING ERROR:", error);
        throw error;
    }
}

export async function getApprovedUsers() {
    try {
        const users = await User.find({ status: "approved" });
        return users;
    } catch (error) {
        console.error("GET APPROVED ERROR:", error);
        throw error;
    }
}

export async function getRejectedUsers() {
    try {
        const users = await User.find({ status: "rejected" });
        return users;
    } catch (error) {
        console.error("GET REJECTED ERROR:", error);
        throw error;
    }
}

export async function getParentsForAnnouncement(announcement) {
    try {
        const query = {
            role: "parent",
            status: "approved"
        };

        if (announcement?.grade) {
            query["profile.children"] = { $elemMatch: { grade: announcement.grade } };
        }

        const parents = await User.find(query).select("email profile.name profile.lastname profile.children");

        return parents;
    } catch (error) {
        console.error("GET PARENTS FOR ANNOUNCEMENT ERROR:", error);
        throw error;
    }
}

export async function approveUser(userId, userEmail) {
    try {
        const user = await User.findById(userId);
        if (!user) return { error: "User not found", status: 404 };

        const previousStatus = user.status;
        
        await User.findByIdAndUpdate(userId, { status: "approved" }, { new: true });
        
        await UserStatusHistory.create({
            userId,
            email: user.email,
            previousStatus: previousStatus,
            newStatus: "approved",
            changedBy: userEmail || "admin"
        });

        return { message: "User approved", status: 200 };
    } catch (error) {
        console.error("APPROVE ERROR:", error);
        return { error: "Error approving user", status: 500 };
    }
}

export async function rejectUser(userId, reason, userEmail) {
    try {
        const user = await User.findById(userId);
        if (!user) return { error: "User not found", status: 404 };

        const previousStatus = user.status;
        
        await User.findByIdAndUpdate(userId, { status: "rejected" }, { new: true });
        
        await UserStatusHistory.create({
            userId,
            email: user.email,
            previousStatus: previousStatus,
            newStatus: "rejected",
            changedBy: userEmail || "admin",
            reason
        });

        return { message: "User rejected", status: 200 };
    } catch (error) {
        console.error("REJECT ERROR:", error);
        return { error: "Error rejecting user", status: 500 };
    }
}

export async function updateUserStatusService(userId, newStatus, reason, userEmail) {
    try {
        if (!["pending", "approved", "rejected"].includes(newStatus)) {
            return { error: "Invalid status", status: 400 };
        }

        const user = await User.findById(userId);
        if (!user) return { error: "User not found", status: 404 };

        const previousStatus = user.status;

        if (previousStatus === newStatus) {
            return { error: "New status is same as previous", status: 400 };
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { status: newStatus }, 
            { new: true }
        );

        await UserStatusHistory.create({
            userId,
            email: user.email,
            previousStatus: previousStatus,
            newStatus: newStatus,
            changedBy: userEmail || "admin",
            reason
        });

        return { user: updatedUser, message: `User status updated to ${newStatus}`, status: 200 };
    } catch (error) {
        console.error("UPDATE STATUS ERROR:", error);
        return { error: "Error updating user status", status: 500 };
    }
}

export async function getUserStatusHistory(userId) {
    try {
        const history = await UserStatusHistory.find({ userId })
            .sort({ changedAt: -1 });
        return history;
    } catch (error) {
        console.error("GET HISTORY ERROR:", error);
        throw error;
    }
}

export async function getAllStatusHistory(page = 1, limit = 20) {
    try {
        const skip = (page - 1) * limit;

        const [history, total] = await Promise.all([
            UserStatusHistory.find()
                .sort({ changedAt: -1 })
                .skip(skip)
                .limit(limit),
            UserStatusHistory.countDocuments()
        ]);

        return {
            data: history,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                totalItems: total
            }
        };
    } catch (error) {
        console.error("GET ALL HISTORY ERROR:", error);
        throw error;
    }
}

export async function createAnnouncement(title, content, authorId, grade) {
    try {
        const announcementId = uuid();
        
        const announcement = await Announcement.create({
            announcementId,
            title,
            content,
            authorId,
            grade: grade || undefined
        });

        try {
            const eventPayload = {
                id: announcement.announcementId,
                title: announcement.title,
                content: announcement.content,
                grade: announcement.grade,
                createdAt: announcement.createdAt?.toISOString?.() || new Date().toISOString(),
                authorId: announcement.authorId
            };

            publish("announcement.created", eventPayload);
        } catch (eventError) {
            console.error("Failed to publish announcement.created event:", eventError.message || eventError);
        }

        return { announcement, status: 201 };
    } catch (error) {
        console.error("CREATE ANNOUNCEMENT ERROR:", error);
        return { error: "Error creating announcement", status: 500 };
    }
}

export async function getAnnouncements(page = 1, limit = 10) {
    try {
        const skip = (page - 1) * limit;

        const [announcements, total] = await Promise.all([
            Announcement.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Announcement.countDocuments()
        ]);

        return {
            data: announcements,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                totalItems: total
            },
            status: 200
        };
    } catch (error) {
        console.error("GET ANNOUNCEMENTS ERROR:", error);
        return { error: "Error fetching announcements", status: 500 };
    }
}

export async function getAnnouncementById(announcementId) {
    try {
        const announcement = await Announcement.findOne({
            announcementId
        });

        if (!announcement) {
            return { error: "Announcement not found", status: 404 };
        }

        return { announcement, status: 200 };
    } catch (error) {
        console.error("GET ANNOUNCEMENT ERROR:", error);
        return { error: "Error fetching announcement", status: 500 };
    }
}

export async function deleteAnnouncement(announcementId) {
    try {
        const result = await Announcement.deleteOne({
            announcementId
        });

        if (result.deletedCount === 0) {
            return { error: "Announcement not found", status: 404 };
        }

        return { message: "Announcement deleted successfully", status: 200 };
    } catch (error) {
        console.error("DELETE ANNOUNCEMENT ERROR:", error);
        return { error: "Error deleting announcement", status: 500 };
    }
}
