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
import img7 from "../images/img7.jpg";
import img8 from "../images/img8.jpg";
import img9 from "../images/img9.jpg";
import img10 from "../images/img10.jpg";
import img11 from "../images/img11.jpg";
import img12 from "../images/img12.jpg";


import maternal from "../images/maternal.jpg";
import jardin from "../images/jardin.jpg";
import primaria from "../images/primaria.jpg";
import "./Home.css";

export default function Home() {
    const carouselImages = [img0, img1, img2, img4, img5, img7, img8, img9, img10, img11, img12];

    const staffDirectivo = [
        {
            name: "Marianela Ayeray Suárez",
            role: "Propietaria y representante legal",
            image: img0
        },
        {
            name: "Alejandra López",
            role: "Directora",
            image: img1
        },
        {
            name: "Maia Alfaro",
            role: "Secretaria",
            image: img2
        }
    ];

    const staffInicial = [
        {
            name: "Ana Rodríguez",
            grade: "Nivel Inicial - Sala de 3 años",
            image: img2
        },
        {
            name: "Lucía Fernández",
            grade: "Nivel Inicial - Sala de 4 años",
            image: img3
        },
    ];

    const staffPrimaria = [
        {
            name: "Carlos Martínez",
            grade: "Primaria - 3er grado",
            image: img4
        },
        {
            name: "Sofía López",
            grade: "Primaria - 6to grado",
            image: img5
        },
    ];

    const staffTalleres = [
        {
            name: "Laura Sánchez",
            grade: "Taller de Música",
            image: img6
        },
        {
            name: "Diego Gómez",
            grade: "Taller de Informática",
            image: img0
        }
    ];

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

            <section id="talleres" className="home-section">
                <div className="section-content">
                    <div className="special-workshops-card">
                        <div className="special-workshops-header">
                            <span className="special-workshops-emoji">🌟</span>
                            <div>
                                <h2>Talleres especiales</h2>
                                <p className="section-subtitle">
                                    Programas complementarios que potencian las habilidades y talentos de nuestros estudiantes.
                                </p>
                            </div>
                        </div>
                        <ul className="special-workshops-list">
                            <li>Cocina</li>
                            <li>Instrumentos musicales</li>
                            <li>Manualidades y reciclado</li>
                            <li>Inglés</li>
                            <li>Informática</li>
                            <li>Yoga</li>
                            <li>Folklore</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section id="staff" className="home-section staff-section">
                <div className="section-content">
                    <h2>Nuestro Staff Docente</h2>
                    <p className="section-subtitle">
                        Conocé a las maestras y maestros que acompañan a los estudiantes en cada etapa.
                    </p>
                    <section className="staff-block">
                        <h3 className="staff-section-title">Cuerpo Directivo</h3>
                        <div className="staff-grid">
                            {staffDirectivo.map((person) => (
                                <article key={person.name} className="staff-card">
                                    <div className="staff-image-wrapper">
                                        <img
                                            src={person.image}
                                            alt={`Foto de ${person.name}`}
                                            className="staff-image"
                                        />
                                    </div>
                                    <div className="staff-info">
                                        <h4 className="staff-name">{person.name}</h4>
                                        <p className="staff-grade">{person.role}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="staff-block">
                        <h3 className="staff-section-title">Cuerpo Docente</h3>

                        <div className="staff-subsection">
                            <h4 className="staff-subtitle">Nivel Inicial</h4>
                            <div className="staff-grid">
                                {staffInicial.map((teacher) => (
                                    <article key={teacher.name} className="staff-card">
                                        <div className="staff-image-wrapper">
                                            <img
                                                src={teacher.image}
                                                alt={`Foto de ${teacher.name}`}
                                                className="staff-image"
                                            />
                                        </div>
                                        <div className="staff-info">
                                            <h4 className="staff-name">{teacher.name}</h4>
                                            <p className="staff-grade">{teacher.grade}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div className="staff-subsection">
                            <h4 className="staff-subtitle">Nivel Primaria</h4>
                            <div className="staff-grid">
                                {staffPrimaria.map((teacher) => (
                                    <article key={teacher.name} className="staff-card">
                                        <div className="staff-image-wrapper">
                                            <img
                                                src={teacher.image}
                                                alt={`Foto de ${teacher.name}`}
                                                className="staff-image"
                                            />
                                        </div>
                                        <div className="staff-info">
                                            <h4 className="staff-name">{teacher.name}</h4>
                                            <p className="staff-grade">{teacher.grade}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div className="staff-subsection">
                            <h4 className="staff-subtitle">Talleres Especiales</h4>
                            <div className="staff-grid">
                                {staffTalleres.map((teacher) => (
                                    <article key={teacher.name} className="staff-card">
                                        <div className="staff-image-wrapper">
                                            <img
                                                src={teacher.image}
                                                alt={`Foto de ${teacher.name}`}
                                                className="staff-image"
                                            />
                                        </div>
                                        <div className="staff-info">
                                            <h4 className="staff-name">{teacher.name}</h4>
                                            <p className="staff-grade">{teacher.grade}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
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