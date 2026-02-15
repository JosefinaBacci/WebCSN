import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import './Admin.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Admin() {
    const { token } = useAuth();
    const [pendingUsers, setPendingUsers] = useState([]);

    const fetchPending = async () => {
        try {
        const res = await fetch(`${API_URL}/users/pending`, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();
        setPendingUsers(data);
        } catch (err) {
        console.error(err);
        }
    };

    useEffect(() => {
        fetchPending();
        const interval = setInterval(fetchPending, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleApprove = async (id: string) => {
        await fetch(`${API_URL}/users/${id}/approve`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        }
        });

        fetchPending();
    };

    const handleReject = async (id: string) => {
        await fetch(`${API_URL}/users/${id}/reject`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        }
        });

        fetchPending();
    };

    return (
        <div className="admin-container">
        <h2>Solicitudes Pendientes</h2>

        {pendingUsers.length === 0 && <p>No hay solicitudes.</p>}

        {pendingUsers.map((user: any) => (
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
    );
}
