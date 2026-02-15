import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token, data.role);
                navigate("/");
            } else if(response.status === 401) {
                setError("Email o contraseña inválidos");
            }else if(response.status === 404){
                setError("Usuario no encontrado");
            } else if(response.status === 403) {
                setError("Tu cuenta aún no fue aprobada por el colegio.");
            }
        } catch (err) {
            setError("Error al conectar con el servidor");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-left">
                    <div className="login-content">
                        <div className="login-logo">
                            <span className="logo-icon">☀️</span>
                            <h1>Colegio Nuevo Sol</h1>
                        </div>
                        <p className="login-subtitle">Bienvenido de vuelta</p>
                        <p className="login-description">Inicia sesión para acceder a tu cuenta</p>
                    </div>
                </div>

                <div className="login-right">
                    <div className="login-form-wrapper">
                        <h2>Iniciar Sesión</h2>
                        
                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
                            <Link to="/" className="back-home">Volver al inicio</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
