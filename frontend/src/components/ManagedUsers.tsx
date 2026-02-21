import { useEffect, useState } from "react";
import { userService } from "../api/userService";
import '../styles/AdminTabs.css';

interface User {
    _id: string;
    email: string;
    profile?: {
        name: string;
        lastname: string;
        children?: Array<{ name: string; grade: string }>;
    };
}

interface Props {
    token: string;
    status: "approved" | "rejected";
    title: string;
}

export default function ManagedUsers({ token, status, title }: Props) {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
    const [changingStatus, setChangingStatus] = useState<string | null>(null);
    const [reasonText, setReasonText] = useState<{ [key: string]: string }>({});

    const fetchUsers = async () => {
        if (!token) return;
        try {
            setIsLoading(true);
            const data = status === "approved" 
                ? await userService.getApproved(token)
                : await userService.getRejected(token);
            setUsers(data || []);
        } catch (err) {
            console.error("Error fetching users:", err);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [status, token]);

    const handleStatusChange = async (userId: string, newStatus: "approved" | "rejected") => {
        if (!token) return;
        try {
            setChangingStatus(userId);
            const reason = reasonText[userId] || "";

            await userService.updateUserStatus(userId, newStatus, token, reason);
            setReasonText(prev => ({ ...prev, [userId]: "" }));
            setUsers(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            console.error("Error changing status:", err);
            alert("Error al cambiar el estado del usuario");
        } finally {
            setChangingStatus(null);
        }
    };

    return (
        <div className="managed-users-container">
            <h3>{title}</h3>

            {isLoading && <p className="loading-text">Cargando usuarios...</p>}

            {!isLoading && users.length === 0 && (
                <p className="no-data">No hay usuarios con este estado.</p>
            )}

            {!isLoading && users.length > 0 && (
                <div className="users-list">
                    {users.map((user) => (
                        <div key={user._id} className="user-card">
                            <div className="user-card-header">
                                <div className="user-basic-info">
                                    <p className="user-name">
                                        {user.profile?.name || "Sin nombre"} {user.profile?.lastname || ""}
                                    </p>
                                    <p className="user-email">{user.email}</p>
                                </div>
                                <button
                                    className="expand-btn"
                                    onClick={() => setExpandedUserId(expandedUserId === user._id ? null : user._id)}
                                >
                                    {expandedUserId === user._id ? "▼" : "▶"}
                                </button>
                            </div>

                            {expandedUserId === user._id && (
                                <div className="user-card-expanded">
                                    {user.profile?.children && user.profile.children.length > 0 && (
                                        <div className="children-section">
                                            <p><strong>Hijos/as:</strong></p>
                                            <ul>
                                                {user.profile.children.map((child, idx) => (
                                                    <li key={idx}>
                                                        {child.name} - Grado: {child.grade}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="status-change-section">
                                        <p><strong>Cambiar Estado:</strong></p>
                                        <div className="reason-input-group">
                                            <input
                                                type="text"
                                                placeholder="Razón del cambio (opcional)"
                                                value={reasonText[user._id] || ""}
                                                onChange={(e) => setReasonText(prev => ({
                                                    ...prev,
                                                    [user._id]: e.target.value
                                                }))}
                                                className="reason-input"
                                            />
                                        </div>

                                        <div className="status-buttons">
                                            {status === "approved" && (
                                                <button
                                                    className="reject-btn"
                                                    onClick={() => handleStatusChange(user._id, "rejected")}
                                                    disabled={changingStatus === user._id}
                                                >
                                                    {changingStatus === user._id ? "Procesando..." : "Rechazar"}
                                                </button>
                                            )}

                                            {status === "rejected" && (
                                                <button
                                                    className="approve-btn"
                                                    onClick={() => handleStatusChange(user._id, "approved")}
                                                    disabled={changingStatus === user._id}
                                                >
                                                    {changingStatus === user._id ? "Procesando..." : "Aceptar"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
