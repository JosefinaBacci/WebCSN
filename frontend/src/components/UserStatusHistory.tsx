import { useEffect, useState } from "react";
import '../styles/AdminTabs.css';

const API_URL = import.meta.env.VITE_API_URL;

interface HistoryEntry {
    _id: string;
    userId: string;
    email: string;
    previousStatus: "pending" | "approved" | "rejected";
    newStatus: "pending" | "approved" | "rejected";
    changedBy: string;
    reason?: string;
    changedAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}

export default function UserStatusHistory({ token }: { token: string }) {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const limit = 15;

    const fetchHistory = async (page: number = 1) => {
        try {
            setIsLoading(true);
            const res = await fetch(
                `${API_URL}/users/admin/history-all?page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();
            setHistory(data.data);
            setPagination(data.pagination);
            setCurrentPage(page);
        } catch (err) {
            console.error("Error fetching history:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(1);
    }, []);

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'approved': return 'status-badge approved';
            case 'rejected': return 'status-badge rejected';
            case 'pending': return 'status-badge pending';
            default: return 'status-badge';
        }
    };

    const getStatusText = (status: string) => {
        const translations: { [key: string]: string } = {
            'approved': 'Aceptado',
            'rejected': 'Rechazado',
            'pending': 'Pendiente'
        };
        return translations[status] || status;
    };

    return (
        <div className="history-container">
            <h3>Historial de Cambios de Estado</h3>

            {isLoading && <p className="loading-text">Cargando historial...</p>}

            {!isLoading && history.length === 0 && (
                <p className="no-data">No hay cambios de estado registrados.</p>
            )}

            {!isLoading && history.length > 0 && (
                <>
                    <div className="history-table-wrapper">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Cambio</th>
                                    <th>Cambió por</th>
                                    <th>Razón</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((entry) => (
                                    <tr key={entry._id} className="history-row">
                                        <td className="email-cell">{entry.email}</td>
                                        <td className="status-change-cell">
                                            <span className={getStatusBadgeClass(entry.previousStatus)}>
                                                {getStatusText(entry.previousStatus)}
                                            </span>
                                            <span className="arrow">→</span>
                                            <span className={getStatusBadgeClass(entry.newStatus)}>
                                                {getStatusText(entry.newStatus)}
                                            </span>
                                        </td>
                                        <td className="changed-by-cell">{entry.changedBy}</td>
                                        <td className="reason-cell">{entry.reason || '-'}</td>
                                        <td className="date-cell">
                                            {new Date(entry.changedAt).toLocaleDateString('es-ES')} {' '}
                                            {new Date(entry.changedAt).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => fetchHistory(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="pagination-btn"
                            >
                                ← Anterior
                            </button>

                            <span className="pagination-info">
                                Página {currentPage} de {pagination.totalPages}
                            </span>

                            <button
                                onClick={() => fetchHistory(Math.min(pagination.totalPages, currentPage + 1))}
                                disabled={currentPage === pagination.totalPages}
                                className="pagination-btn"
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
