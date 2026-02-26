import Hero from "../shared/components/Hero";
import FlipCard from "../shared/components/FlipCard";
import ImageCarousel from "../shared/components/ImageCarousel";
import ContactForm from "../shared/components/ContactForm";
import SectionCard from "../shared/components/SectionCard";
import img0 from "../images/img0.jpg";
import img1 from "../images/img1.jpg";
import img2 from "../images/img2.jpg";
import img3 from "../images/img3.jpg";
import img4 from "../images/img4.jpg";
import img5 from "../images/img5.jpg";
import img6 from "../images/img6.jpg";
import maternal from "../images/maternal.jpg";
import jardin from "../images/jardin.jpg";
import primaria from "../images/primaria.jpg";
import "./Home.css";

export default function Home() {
    const carouselImages = [img0, img1, img2, img3, img4, img5, img6];

    return (
        <>
            <Hero />

            <section id="about" className="home-section">
                <div className="section-content">
                    <h2>Sobre Nosotros</h2>
                    <p className="section-subtitle">Tres niveles educativos con excelencia académica</p>
                    <div className="flip-cards-container">
                        <FlipCard 
                            icon="👶"
                            title="Maternal" 
                            frontText="Estimulación temprana"
                            backText="Primeros vínculos y desarrollo sensorial en un ambiente seguro y cálido."
                        />
                        <FlipCard 
                            icon="🎨"
                            title="Jardín" 
                            frontText="Juego y creatividad"
                            backText="Aprendizaje a través del juego, desarrollando habilidades sociales."
                        />
                        <FlipCard 
                            icon="📚"
                            title="Primaria" 
                            frontText="Educación integral"
                            backText="Formación académica sólida con valores y pensamiento crítico."
                        />
                    </div>
                </div>
            </section>

            <section id="images" className="home-section home-section-gray">
                <div className="section-content">
                    <ImageCarousel 
                        images={carouselImages}
                        title="Nuestras Instalaciones"
                    />
                </div>
            </section>

            <section id="maternal" className="home-section">
                <div className="section-content">
                    <div className="detailed-cards-container">
                        <SectionCard
                            icon="👶"
                            title="Maternal"
                            description="Un espacio seguro y acogedor para los más pequeños"
                            features={[
                                "Estimulación sensorial temprana",
                                "Desarrollo motor y cognitivo",
                                "Ambiente seguro y cálido",
                                "Personal especializado"
                            ]}
                            image={maternal}
                        />
                        <SectionCard
                            icon="🎨"
                            title="Jardín"
                            description="Fomentamos la curiosidad a través del juego"
                            features={[
                                "Aprendizaje lúdico",
                                "Desarrollo de habilidades sociales",
                                "Creatividad y expresión artística",
                                "Primeras nociones académicas"
                            ]}
                            image={jardin}
                        />
                        <SectionCard
                            icon="📚"
                            title="Primaria"
                            description="Educación integral con excelencia académica"
                            features={[
                                "Formación académica sólida",
                                "Valores y ética",
                                "Pensamiento crítico",
                                "Habilidades del siglo XXI"
                            ]}
                            image={primaria}
                        />
                    </div>
                </div>
            </section>

            <section id="contact" className="home-section home-section-gray">
                <div className="section-content">
                    <h2>Contáctanos</h2>
                    <p className="section-subtitle">¿Preguntas? Nos encantaría escucharte</p>
                    <ContactForm />
                </div>
            </section>
        </>
    );
}