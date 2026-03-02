import {
    login,
    registerUser,
    getPendingUsers,
    getApprovedUsers,
    getRejectedUsers,
    approveUser,
    rejectUser,
    updateUserStatusService,
    getUserStatusHistory,
    getAllStatusHistory,
    getUserById,
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    deleteAnnouncement,
    getParentsForAnnouncement
} from "../services/unified.service.js";
import { resend } from "../mail/resend.js";

// Auth routes
export async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        const result = await login(email, password);
        
        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }
        
        res.json({ token: result.token, role: result.role });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Login failed" });
    }
}

// User registration
export async function registerController(req, res) {
    try {
        const result = await registerUser(req.body);
        
        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }
        
        res.status(201).json({ message: "User registered", id: result.user._id });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Error registering user" });
    }
}

// Get pending users
export async function getPendingController(req, res) {
    try {
        const users = await getPendingUsers();
        res.json(users);
    } catch (error) {
        console.error("Get pending error:", error);
        res.status(500).json({ message: "Error fetching pending users" });
    }
}

// Get approved users
export async function getApprovedController(req, res) {
    try {
        const users = await getApprovedUsers();
        res.json(users);
    } catch (error) {
        console.error("Get approved error:", error);
        res.status(500).json({ message: "Error fetching approved users" });
    }
}

// Get rejected users
export async function getRejectedController(req, res) {
    try {
        const users = await getRejectedUsers();
        res.json(users);
    } catch (error) {
        console.error("Get rejected error:", error);
        res.status(500).json({ message: "Error fetching rejected users" });
    }
}

// Approve user
export async function approveController(req, res) {
    try {
        const result = await approveUser(req.params.id, req.user?.email);
        
        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }
        
        res.json(result);
    } catch (error) {
        console.error("Approve error:", error);
        res.status(500).json({ message: "Error approving user" });
    }
}

// Reject user
export async function rejectController(req, res) {
    try {
        const { reason } = req.body;
        const result = await rejectUser(req.params.id, reason, req.user?.email);
        
        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }
        
        res.json(result);
    } catch (error) {
        console.error("Reject error:", error);
        res.status(500).json({ message: "Error rejecting user" });
    }
}

// Get user status history
export async function getUserHistoryController(req, res) {
    try {
        const history = await getUserStatusHistory(req.params.id);
        res.json(history);
    } catch (error) {
        console.error("Get history error:", error);
        res.status(500).json({ message: "Error fetching user history" });
    }
}

// Get all status history
export async function getAllHistoryController(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = await getAllStatusHistory(page, limit);
        res.json(result);
    } catch (error) {
        console.error("Get all history error:", error);
        res.status(500).json({ message: "Error fetching all history" });
    }
}

// Update user status
export async function updateUserStatusController(req, res) {
    try {
        const { newStatus, reason } = req.body;
        const result = await updateUserStatusService(
            req.params.id,
            newStatus,
            reason,
            req.user?.email
        );
        
        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }
        
        res.json(result);
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({ message: "Error updating user status" });
    }
}

// Announcements controllers
export async function createAnnouncementController(req, res) {
    try {
        const { title, content, grade } = req.body;
        const authorId = req.user?.sub;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const result = await createAnnouncement(title, content, authorId, grade);
        
        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }

        const announcement = result.announcement;
        const parents = await getParentsForAnnouncement(announcement);

        const formatGradeLabel = (g) => {
            const map = {
                maternal: "Maternal",
                sala3: "Sala de 3",
                sala4: "Sala de 4",
                sala5: "Sala de 5",
                "1": "1° grado",
                "2": "2° grado",
                "3": "3° grado",
                "4": "4° grado",
                "5": "5° grado",
                "6": "6° grado",
                "7": "7° grado",
            };
            return map[g] || g;
        };
        Promise.all(
            parents.map(user =>
                resend.emails.send({
                    from: '"Colegio Nuevo Sol" <colegionuevosolzapala@colegionuevosolzapala.com>',
                    to: user.email,
                    subject: `📢 Nuevo comunicado: ${announcement.title}`,
                    html: `
                        <h2>${announcement.title}</h2>
                        <p>${announcement.content}</p>
                        ${announcement.grade ? `<p><strong>Destinatarios:</strong> ${formatGradeLabel(announcement.grade)}</p>` : ""}
                        <p>Fecha: ${new Date(announcement.createdAt).toISOString().split('T')[0]}</p>
                        <hr />
                    `
                }).catch(err => {
                    console.error(`Error sending to ${user.email}:`, err);
                })
            )
        );

        res.status(201).json({
            message: "Announcement created",
            id: announcement.announcementId
        });

    } catch (error) {
        console.error("Create announcement error:", error);
        res.status(500).json({ message: "Error creating announcement" });
    }
}

export async function getAnnouncementsController(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await getAnnouncements(page, limit);
        
        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }

        res.json(result);
    } catch (error) {
        console.error("Get announcements error:", error);
        res.status(500).json({ message: "Error fetching announcements" });
    }
}

export async function getAnnouncementController(req, res) {
    try {
        const result = await getAnnouncementById(req.params.id);
        
        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }

        res.json(result.announcement);
    } catch (error) {
        console.error("Get announcement error:", error);
        res.status(500).json({ message: "Error fetching announcement" });
    }
}

export async function deleteAnnouncementController(req, res) {
    try {
        const result = await deleteAnnouncement(req.params.id);
        
        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }

        res.json(result);
    } catch (error) {
        console.error("Delete announcement error:", error);
        res.status(500).json({ message: "Error deleting announcement" });
    }
}

// Contact form controller
export async function contactFormController(req, res) {
    try {
        const { name, email, phone, level, message } = req.body;

        if (!name || !email || !message || !level) {
            return res.status(400).json({ message: "Incomplete data" });
        }

        const response = await resend.emails.send({
            from: '"Colegio Nuevo Sol" <colegionuevosolzapala@colegionuevosolzapala.com>', 
            to: "colegionuevosolzapala@gmail.com", 
            subject: `Nueva consulta web – ${level}`,
            html: `
                <h3>Nueva consulta desde la web</h3>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${phone || "-"}</p>
                <p><strong>Nivel:</strong> ${level}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
                <p>Enviado: ${new Date().toLocaleString()}</p>
            `,
        });

        console.log("Resend email response:", response);

        res.status(200).json({ ok: true, message: "Contact form submitted successfully" });
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({ message: "Error processing contact form" });
    }
}