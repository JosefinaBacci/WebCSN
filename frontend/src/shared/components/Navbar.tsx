import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import logoImage from "../../images/logo.png";
import "./Navbar.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Navbar() {
    const { token, role, logout } = useAuth();
    const { pathname } = useLocation();
    const isLoggedIn = !!token;
    const isAdmin = role === "admin";
    const isAnnouncementsPage = pathname === "/announcements";
    const isAdminPage = pathname === "/admin";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasPendingRequests, setHasPendingRequests] = useState(false);

    const renderBellIcon = () => (
        hasPendingRequests ? (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-bell-dot-icon"
            >
                <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                <path d="M11.68 2.009A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673c-.824-.85-1.678-1.731-2.21-3.348" />
                <circle cx="18" cy="5" r="3" />
            </svg>
        ) : (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-bell-icon"
            >
                <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
            </svg>
        )
    );

    const renderMegaphoneIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-megaphone-icon"
        >
            <path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
            <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
            <path d="M8 6v8" />
        </svg>
    );

    useEffect(() => {
        if (!token || role !== "admin") return;

        const fetchPending = async () => {
            try {
                const res = await fetch(`${API_URL}/users/pending`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) return;

                const data = await res.json();
                setHasPendingRequests(data.length > 0);
            } catch (err) {
                console.error("Error fetching pending users", err);
            }
        };

        fetchPending();
    }, [token, role]);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1280) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    if (isAnnouncementsPage && !isLoggedIn) {
        return (
            <nav className="navbar navbar-simple">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        <span className="logo-icon">
                            <img src={logoImage} alt="Logo" className="navbar-logo-img"/>
                        </span>
                        Colegio Nuevo Sol
                    </Link>
                    <Link to="/login" className="navbar-login-btn">
                        Iniciar Sesión
                    </Link>
                </div>
            </nav>
        );
    }

    if (isAnnouncementsPage && isLoggedIn) {
        return (
            <nav className="navbar navbar-simple">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        <span className="logo-icon">
                            <img src={logoImage} alt="Logo" className="navbar-logo-img"/>
                        </span>
                        Colegio Nuevo Sol
                    </Link>
                    <button onClick={handleLogout} className="navbar-logout-btn">
                        Cerrar Sesión
                    </button>
                </div>
            </nav>
        );
    }

    if(isAdminPage && isLoggedIn && isAdmin) {
        return (
            <nav className="navbar navbar-simple">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        <span className="logo-icon">
                            <img src={logoImage} alt="Logo" className="navbar-logo-img"/>
                        </span>
                        Colegio Nuevo Sol
                    </Link>
                    <button onClick={handleLogout} className="navbar-logout-btn">
                        Cerrar Sesión
                    </button>
                </div>
            </nav>
        );
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">
                        <img src={logoImage} alt="Logo" className="navbar-logo-img"/>
                    </span>
                    Colegio Nuevo Sol
                </Link>
                <button 
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                    <li>
                        <button onClick={() => scrollToSection("about")}>
                            Sobre Nosotros
                        </button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection("staff")}>
                            Staff
                        </button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection("maternal")}>
                            Educación
                        </button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection("contact")}>
                            Contacto
                        </button>
                    </li>
                    {isLoggedIn && (
                        <li>
                            <Link
                                to="/announcements"
                                onClick={() => setIsMenuOpen(false)}
                                className={isAdmin ? "admin-icon-link" : undefined}
                                aria-label={isAdmin && !isMenuOpen ? "Ir a anuncios" : undefined}
                            >
                                {isAdmin && !isMenuOpen ? (
                                    <span className="admin-circle-icon" aria-hidden="true" title="Anuncios">
                                        {renderMegaphoneIcon()}
                                    </span>
                                ) : (
                                    "Anuncios"
                                )}
                            </Link>
                        </li>
                    )}
                    {isLoggedIn && isAdmin &&(
                        <li>
                            <Link 
                                to="/admin" 
                                className="admin-requests-link"
                                onClick={() => setIsMenuOpen(false)} 
                                aria-label={!isMenuOpen ? "Ver solicitudes pendientes" : undefined}
                            >
                                {isMenuOpen ? (
                                    <span className="admin-text">Solicitudes</span>
                                ) : (
                                    <span
                                        className="admin-circle-icon"
                                        aria-hidden="true"
                                        title={hasPendingRequests ? "Solicitudes pendientes" : "Sin solicitudes"}
                                    >
                                        {renderBellIcon()}
                                    </span>
                                )}
                                {hasPendingRequests && <span className="notification-dot"></span>}
                            </Link>
                        </li>
                    )}
                    {isLoggedIn && isMenuOpen && (
                        <li>
                            <button onClick={handleLogout} className="mobile-logout-btn">
                                Cerrar Sesión
                            </button>
                        </li>
                    )}

                </ul>
                {!isLoggedIn && (
                    <Link to="/login" className="navbar-login-btn">
                        Iniciar Sesión
                    </Link>
                )}
                {isLoggedIn && !isMenuOpen && (
                    <button onClick={handleLogout} className="navbar-logout-btn desktop-logout">
                        Cerrar Sesión
                    </button>
                )}
            </div>
        </nav>
    );
}
