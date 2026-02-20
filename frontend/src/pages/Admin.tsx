import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserStatusHistory from "../components/UserStatusHistory";
import ManagedUsers from "../components/ManagedUsers";
import './Admin.css';
import '../styles/AdminTabs.css';

const API_URL = import.meta.env.VITE_API_URL;

type TabType = "pending" | "approved" | "rejected" | "history";

export default function Admin() {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>("pending");
    const [pendingUsers, setPendingUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPending = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${API_URL}/users/pending`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            setPendingUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "pending") {
            fetchPending();
            const interval = setInterval(fetchPending, 5000);
            return () => clearInterval(interval);
        }
    }, [activeTab]);

    const handleApprove = async (id: string, reason?: string) => {
        try {
            await fetch(`${API_URL}/users/${id}/approve`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ reason })
            });
            fetchPending();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async (id: string, reason?: string) => {
        try {
            await fetch(`${API_URL}/users/${id}/reject`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ reason })
            });
            fetchPending();
        } catch (err) {
            console.error(err);
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
                    📋 Pendientes
                </button>
                <button
                    className={`tab-btn ${activeTab === "approved" ? "active" : ""}`}
                    onClick={() => setActiveTab("approved")}
                >
                    ✅ Aceptados
                </button>
                <button
                    className={`tab-btn ${activeTab === "rejected" ? "active" : ""}`}
                    onClick={() => setActiveTab("rejected")}
                >
                    ❌ Rechazados
                </button>
                <button
                    className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
                    onClick={() => setActiveTab("history")}
                >
                    📊 Historial
                </button>
            </div>

            {activeTab === "pending" && (
                <div className="tab-content">
                    <h3>Solicitudes Pendientes</h3>

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
