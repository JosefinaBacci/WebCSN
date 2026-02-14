import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import "./Navbar.css";


export default function Navbar() {
    const { token, role, logout } = useAuth();
    const { pathname } = useLocation();
    const isLoggedIn = !!token;
    const isAdmin = role === "admin";
    const isAnnouncementsPage = pathname === "/announcements";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasPendingRequests, setHasPendingRequests] = useState(false);

    useEffect(() => {
        if (!token || role !== "admin") return;

        const fetchPending = async () => {
            try {
                const res = await fetch("http://localhost:4000/users/pending", {
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
                        <span className="logo-icon">🎓</span>
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
                        <span className="logo-icon">🎓</span>
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
                    <span className="logo-icon">🎓</span>
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
                            <Link to="/announcements" onClick={() => setIsMenuOpen(false)}>
                                Anuncios
                            </Link>
                        </li>
                    )}
                    {isLoggedIn && isAdmin &&(
                        <li>
                            <Link 
                                to="/admin" 
                                className="admin-requests-link"
                                onClick={() => setIsMenuOpen(false)} 
                            >
                                <span className="admin-text">{isMenuOpen ? "Solicitudes" : "🔔"}</span>
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