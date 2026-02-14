import { useState } from "react";
import "./ContactForm.css";

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
            const response = await fetch("http://localhost:4000/notifications/contact-form", {
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

    return (
        <div className="contact-form-wrapper">
            <div className="contact-info">
                <div className="info-card">
                    <div className="info-icon">📍</div>
                    <h4>Ubicación</h4>
                    <p>Av. 12 de Julio 599, Zapala</p>
                </div>
                <div className="info-card">
                    <div className="info-icon">📞</div>
                    <h4>Teléfono</h4>
                    <p>+54 2942 674852</p>
                </div>
                <div className="info-card">
                    <div className="info-icon">✉️</div>
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
                            <option value="">Selecciona un nivel</option>
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