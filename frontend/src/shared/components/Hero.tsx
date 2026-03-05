import "./Hero.css";
import sunImage from "../../images/sun.png";

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Bienvenido a Colegio Nuevo Sol</h1>
                <p>Educación de calidad para Maternal, Jardín y Primaria</p>
            </div>
            <div className="hero-image">
                <div className="hero-sun-wrapper">
                    <img src={sunImage} alt="Sol" className="hero-sun" />
                </div>
            </div>
        </section>
    );
}
