import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import './Announcements.css';
import { io } from "socket.io-client";

interface Announcement {
    _id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    grade?: string;
}

const ITEMS_PER_PAGE = 4;
const MAX_PREVIEW_LENGTH = 150;
const API_URL = import.meta.env.VITE_API_URL;
const WS_URL  = import.meta.env.VITE_WS_URL;

export default function Announcements() {
    const { token, role } = useAuth();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Debes iniciar sesión para ver los anuncios");
            setLoading(false);
            return;
        }

        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`${API_URL}/announcements`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al cargar anuncios");
                }

                const result = await response.json();
                setAnnouncements(result.data);
                setCurrentPage(1);
            } catch (err) {
                setError("No pudimos cargar los anuncios");
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, [token]);

    useEffect(() => {
        if (!token) return;

        const socket = io(WS_URL);

        socket.on("new-announcement", (announcement: Announcement) => {
            setAnnouncements(prev => [announcement, ...prev]);
            setCurrentPage(1);
        });

        return () => {
            socket.disconnect();
        };
    }, [token]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const paginatedAnnouncements = announcements.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const closeModal = () => {
        setSelectedAnnouncement(null);
    };

    const handleCreateAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.content.trim()) {
            alert("Por favor completa todos los campos");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/announcements`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setFormData({ title: "", content: "" });
                setShowCreateModal(false);
            } else {
                alert("Error al crear el anuncio");
            }
        } catch (err) {
            console.error(err);
            alert("Error al conectar con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="announcements-container">
            <div className="announcements-header">
                <h1>Anuncios</h1>
                <p>Últimas noticias y comunicados del colegio</p>
            </div>
            {role === "admin" && (
                <button 
                    className="create-announcement-btn"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Nuevo Anuncio
                </button>
            )}

            {loading && <div className="loading">Cargando anuncios...</div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && announcements.length === 0 && (
                <div className="no-announcements">
                    <p>No hay anuncios disponibles en este momento</p>
                </div>
            )}

            {!loading && !error && announcements.length > 0 && (
                <>
                    <div className="announcements-list">
                        {paginatedAnnouncements.map((announcement) => (
                            <div key={announcement._id} className="announcement-card">
                                <div className="announcement-header-card">
                                    <h2>{announcement.title}</h2>
                                    {announcement.grade && (
                                        <span className="grade-badge">{announcement.grade}</span>
                                    )}
                                </div>
                                <p className="announcement-content">
                                    {truncateText(announcement.content, MAX_PREVIEW_LENGTH)}
                                </p>
                                {announcement.content.length > MAX_PREVIEW_LENGTH && (
                                    <button 
                                        className="read-more-btn"
                                        onClick={() => setSelectedAnnouncement(announcement)}
                                    >
                                        Ver más
                                    </button>
                                )}
                                <div className="announcement-meta">
                                    <span className="author">Directora Alejandra López</span>
                                    <span className="date">{formatDate(announcement.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                className="pagination-btn"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                ← Anterior
                            </button>
                            <div className="pagination-info">
                                Página {currentPage} de {totalPages}
                            </div>
                            <button 
                                className="pagination-btn"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </>
            )}

            {selectedAnnouncement && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModal}>✕</button>
                        <div className="modal-header">
                            <h2>{selectedAnnouncement.title}</h2>
                            {selectedAnnouncement.grade && (
                                <span className="grade-badge">{selectedAnnouncement.grade}</span>
                            )}
                        </div>
                        <p className="modal-content-text">{selectedAnnouncement.content}</p>
                        <div className="modal-meta">
                            <span className="author">Directora Alejandra López</span>
                            <span className="date">{formatDate(selectedAnnouncement.createdAt)}</span>
                        </div>
                    </div>
                </div>
            )}

            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>✕</button>
                        <div className="modal-header">
                            <h2>Crear Nuevo Anuncio</h2>
                        </div>
                        <form onSubmit={handleCreateAnnouncement} className="create-form">
                            <div className="form-group">
                                <label htmlFor="title">Título</label>
                                <input
                                    type="text"
                                    id="title"
                                    placeholder="Ingresa el título del anuncio"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="content">Contenido</label>
                                <textarea
                                    id="content"
                                    placeholder="Ingresa el contenido del anuncio"
                                    rows={6}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    disabled={isSubmitting}
                                ></textarea>
                            </div>
                            <div className="form-buttons">
                                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                    {isSubmitting ? "Publicando..." : "Publicar Anuncio"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
