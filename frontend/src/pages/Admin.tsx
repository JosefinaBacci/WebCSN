import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserStatusHistory from "../features/users/UserStatusHistory";
import ManagedUsers from "../features/users/ManagedUsers";
import { userService } from "../api/userService";
import io from "socket.io-client";
import './Admin.css';
import '../styles/AdminTabs.css';

const WS_URL = import.meta.env.VITE_WS_URL;

type TabType = "pending" | "approved" | "rejected" | "history";

interface User {
    _id: string;
    email: string;
    profile?: {
        name: string;
        lastname: string;
        children?: Array<{ name: string; grade: string }>;
    };
}

export default function Admin() {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>("pending");
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPending = async () => {
        if (!token) return;
        try {
            setIsLoading(true);
            setError(null);
            const data = await userService.getPending(token);
            setPendingUsers(data || []);
        } catch (err) {
            console.error("Error fetching pending users:", err);
            const errorMsg = err instanceof Error ? err.message : "Error al cargar solicitudes";
            setError(errorMsg);
            setPendingUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "pending" && token) {
            fetchPending();

            const socket = io(WS_URL, {
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5
            });

            socket.on("new-pending-user", (newUser) => {
                console.log("New pending user received:", newUser);
                setPendingUsers((prev) => [newUser, ...prev]);
            });

            socket.on("user-approved", (userId) => {
                console.log("User approved:", userId);
                setPendingUsers((prev) => prev.filter((u: any) => u._id !== userId));
            });

            socket.on("user-rejected", (userId) => {
                console.log("User rejected:", userId);
                setPendingUsers((prev) => prev.filter((u: any) => u._id !== userId));
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [activeTab, token]);

    const handleApprove = async (id: string, reason?: string) => {
        if (!token) return;
        try {
            await userService.approveUser(id, token, reason);
            setPendingUsers((prev) => prev.filter((u: any) => u._id !== id));
        } catch (err) {
            console.error("Error approving user:", err);
            const errorMsg = err instanceof Error ? err.message : "Error al aceptar usuario";
            setError(errorMsg);
        }
    };

    const handleReject = async (id: string, reason?: string) => {
        if (!token) return;
        try {
            await userService.rejectUser(id, token, reason);
            setPendingUsers((prev) => prev.filter((u: any) => u._id !== id));
        } catch (err) {
            console.error("Error rejecting user:", err);
            const errorMsg = err instanceof Error ? err.message : "Error al rechazar usuario";
            setError(errorMsg);
        }
    };

    return (
        <div className="admin-container">
            <h2>Panel de Administración</h2>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
                    onClick={() => setActiveTab("pending")}
                >
                    Pendientes
                </button>
                <button
                    className={`tab-btn ${activeTab === "approved" ? "active" : ""}`}
                    onClick={() => setActiveTab("approved")}
                >
                    Aceptados
                </button>
                <button
                    className={`tab-btn ${activeTab === "rejected" ? "active" : ""}`}
                    onClick={() => setActiveTab("rejected")}
                >
                    Rechazados
                </button>
                <button
                    className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
                    onClick={() => setActiveTab("history")}
                >
                    Historial
                </button>
            </div>

            {activeTab === "pending" && (
                <div className="tab-content">
                    <h3>Solicitudes Pendientes</h3>

                    {error && <div style={{ color: '#dc3545', padding: '1rem', marginBottom: '1rem' }}>{error}</div>}

                    {isLoading && <p className="loading-text">Cargando solicitudes...</p>}

                    {!isLoading && pendingUsers.length === 0 && <p className="no-data">No hay solicitudes pendientes.</p>}

                    {!isLoading && pendingUsers.map((user: any) => (
                        <div key={user._id} className="request-card">
                            <div className="user-info">
                                <div className="info-group">
                                    <div className="info-group-row">
                                        <p><strong>Nombre:</strong> {user.profile?.name}</p>
                                        <p><strong>Apellido:</strong> {user.profile?.lastname}</p>
                                    </div>
                                    <p><strong>Email:</strong> {user.email}</p>
                                </div>

                                {user.profile?.children && user.profile.children.length > 0 && (
                                    <div className="children-info">
                                        <p><strong>Hijos/as:</strong></p>
                                        <ul>
                                            {user.profile.children.map((child: any, idx: number) => (
                                                <li key={idx}>
                                                    {child.name} - Grado: {child.grade}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="buttons">
                                <button
                                    className="approve-btn"
                                    onClick={() => handleApprove(user._id)}
                                >
                                    Aceptar
                                </button>

                                <button
                                    className="reject-btn"
                                    onClick={() => handleReject(user._id)}
                                >
                                    Denegar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "approved" && token && (
                <div className="tab-content">
                    <ManagedUsers 
                        token={token} 
                        status="approved" 
                        title="Usuarios Aceptados"
                    />
                </div>
            )}

            {activeTab === "rejected" && token && (
                <div className="tab-content">
                    <ManagedUsers 
                        token={token} 
                        status="rejected" 
                        title="Usuarios Rechazados"
                    />
                </div>
            )}

            {activeTab === "history" && token && (
                <div className="tab-content">
                    <UserStatusHistory token={token} />
                </div>
            )}
        </div>
    );
}
