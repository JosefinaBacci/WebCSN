import { useState } from "react";
import "./ContactForm.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        level: "",
        message: ""
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/notifications/contact-form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error enviando formulario");
            }

            setSubmitted(true);
            setFormData({
                name: "",
                email: "",
                phone: "",
                level: "",
                message: "",
            });

            setTimeout(() => setSubmitted(false), 5000);

        } catch (error: any) {
            console.error(error);
            setSubmitted(false);
        } finally {
            setLoading(false);
        }
    };

    const iconStyle = { color: "var(--light)" };

    const mapPinIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-map-pin-icon lucide-map-pin"
            style={iconStyle}
            aria-hidden="true"
        >
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );

    const phoneIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-phone-icon lucide-phone"
            style={iconStyle}
            aria-hidden="true"
        >
            <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
        </svg>
    );

    const mailIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-mail-icon lucide-mail"
            style={iconStyle}
            aria-hidden="true"
        >
            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
            <rect x="2" y="4" width="20" height="16" rx="2" />
        </svg>
    );

    return (
        <div className="contact-form-wrapper">
            <div className="contact-info">
                <div className="info-card">
                    <div className="info-icon">{mapPinIcon}</div>
                    <h4>Ubicación</h4>
                    <p>Av. 12 de Julio 599, Zapala</p>
                </div>
                <div className="info-card">
                    <div className="info-icon">{phoneIcon}</div>
                    <h4>Teléfono</h4>
                    <p>+54 2942 337952</p>
                </div>
                <div className="info-card">
                    <div className="info-icon">{mailIcon}</div>
                    <h4>Email</h4>
                    <p>colegionuevosolzapala@gmail.com</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name">Nombre Completo *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                            required
                        />
                    </div>
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
                        <label htmlFor="phone">Teléfono</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+54 (222) 123-4567"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="level">Nivel de Interés *</label>
                        <select
                            id="level"
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona nivel</option>
                            <option value="maternal">Maternal</option>
                            <option value="jardin">Jardín</option>
                            <option value="primaria">Primaria</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="message">Mensaje *</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Cuéntanos cómo podemos ayudarte..."
                        rows={5}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Mensaje"}
                </button>

                {submitted && (
                    <div className="success-message">
                        ✓ ¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.
                    </div>
                )}
            </form>
        </div>
    );
}
