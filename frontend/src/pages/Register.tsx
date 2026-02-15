import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
    const [formData, setFormData] = useState({
        role: "parent",
        email: "",
        password: "",
        confirmPassword: "",
        profile: {
            name: "",
            lastname: "",
            children: [{ name: "", grade: "" }]
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name.startsWith("profile.")) {
            const field = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleChildChange = (index: number, field: "name" | "grade", value: string) => {
        setFormData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                children: prev.profile.children.map((child, i) =>
                    i === index ? { ...child, [field]: value } : child
                )
            }
        }));
    };

    const addChild = () => {
        setFormData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                children: [...prev.profile.children, { name: "", grade: "" }]
            }
        }));
    };

    const removeChild = (index: number) => {
        if (formData.profile.children.length > 1) {
            setFormData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    children: prev.profile.children.filter((_, i) => i !== index)
                }
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        // Validaciones
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (formData.password.length < 4) {
            setError("La contraseña debe tener al menos 4 caracteres");
            return;
        }

        if (!formData.profile.children.every(child => child.name && child.grade)) {
            setError("Completa el nombre y grado de todos los hijos");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                role: "parent",
                email: formData.email,
                password: formData.password,
                profile: {
                    name: formData.profile.name,
                    lastname: formData.profile.lastname,
                    children: formData.profile.children
                }
            };

            const response = await fetch(`${API_URL}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/");
                }, 2500);
            } else if(response.status === 409) {
                setError("Ya existe una cuenta con este email");
            }else if (response.status === 400) {
                const data = await response.json();
                setError(data.message || "Error al registrar");
            }
        } catch (err) {
            setError("Error al conectar con el servidor");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-wrapper">
                <div className="register-left">
                    <div className="register-content">
                        <div className="register-logo">
                            <span className="logo-icon">☀️</span>
                            <h1>Colegio Nuevo Sol</h1>
                        </div>
                        <p className="register-subtitle">Únete a Nuestra Comunidad</p>
                        <p className="register-description">Crea tu cuenta como padre/madre/tutor</p>
                    </div>
                </div>

                <div className="register-right">
                    <div className="register-form-wrapper">
                        {!success ? (
                            <>
                                <h2>Crear Cuenta</h2>

                                {error && <div className="error-message">{error}</div>}

                                <form onSubmit={handleSubmit} className="register-form">
                            {/* Email y Contraseña */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
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
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">Contraseña *</label>
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
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Datos del Padre */}
                            <h3 className="form-section-title">Datos Personales</h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Nombre *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="profile.name"
                                        value={formData.profile.name}
                                        onChange={handleChange}
                                        placeholder="Tu nombre"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastname">Apellido *</label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        name="profile.lastname"
                                        value={formData.profile.lastname}
                                        onChange={handleChange}
                                        placeholder="Tu apellido"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Hijos */}
                            <h3 className="form-section-title">Hijos/as</h3>

                            {formData.profile.children.map((child, index) => (
                                <div key={index} className="child-section">
                                    <div className="child-header">
                                        <h4>Hijo/a</h4>
                                        {formData.profile.children.length > 1 && (
                                            <button
                                                type="button"
                                                className="remove-child-btn"
                                                onClick={() => removeChild(index)}
                                                title="Eliminar este hijo"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor={`child-name-${index}`}>Nombre *</label>
                                            <input
                                                type="text"
                                                id={`child-name-${index}`}
                                                value={child.name}
                                                onChange={(e) => handleChildChange(index, "name", e.target.value)}
                                                placeholder="Nombre del hijo"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor={`child-grade-${index}`}>Grado *</label>
                                            <select
                                                id={`child-grade-${index}`}
                                                value={child.grade}
                                                onChange={(e) => handleChildChange(index, "grade", e.target.value)}
                                                required
                                            >
                                                <option value="">Selecciona grado</option>
                                                <option value="1">1°</option>
                                                <option value="2">2°</option>
                                                <option value="3">3°</option>
                                                <option value="4">4°</option>
                                                <option value="5">5°</option>
                                                <option value="6">6°</option>
                                                <option value="7">7°</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button type="button" className="add-child-btn" onClick={addChild}>
                                + Agregar Otro Hijo
                            </button>

                            <button type="submit" className="register-btn" disabled={loading}>
                                {loading ? "Registrando..." : "Crear Cuenta"}
                            </button>
                        </form>

                        <div className="register-footer">
                            <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
                            <Link to="/" className="back-home">Volver al inicio</Link>
                        </div>
                            </>
                        ) : (
                            <div className="success-container">
                                <div className="success-message-large">
                                    <div className="success-icon">✓</div>
                                    <h2>¡Registro Exitoso!</h2>
                                    <p>Tu cuenta ha sido creada correctamente.</p>
                                    <p className="redirect-text">Redirigiendo al inicio...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
