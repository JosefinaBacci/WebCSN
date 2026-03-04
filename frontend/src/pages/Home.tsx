import Hero from "../shared/components/Hero";
import FlipCard from "../shared/components/FlipCard";
import ImageCarousel from "../shared/components/ImageCarousel";
import ContactForm from "../shared/components/ContactForm";
import SectionCard from "../shared/components/SectionCard";

import img0 from "../images/img0.jpg";
import img1 from "../images/img1.jpg";
import img2 from "../images/img2.jpg";
import img4 from "../images/img4.jpg";
import img7 from "../images/img7.jpg";
import img8 from "../images/img8.jpg";
import img9 from "../images/img9.jpg";
import img10 from "../images/img10.jpg";
import img11 from "../images/img11.jpg";
import img13 from "../images/img13.jpg";
import img14 from "../images/img14.jpg";
import img15 from "../images/img15.jpg";

import staff0 from "../images/staff/staff0.png";
import staff1 from "../images/staff/staff1.png";
import staff2 from "../images/staff/staff2.png";
import staff3 from "../images/staff/staff3.png";
import staff4 from "../images/staff/staff4.png";
import staff5 from "../images/staff/staff5.png";
import staff6 from "../images/staff/staff6.png";
import staff7 from "../images/staff/staff7.png";
import staff8 from "../images/staff/staff8.png";
import staff9 from "../images/staff/staff9.png";
import staff10 from "../images/staff/staff10.png";
import staff11 from "../images/staff/staff11.png";
import staff12 from "../images/staff/staff12.png";
import staff13 from "../images/staff/staff13.png";
import staff14 from "../images/staff/staff14.png";
import staff15 from "../images/staff/staff15.png"
import staff16 from "../images/staff/staff16.png"
import staff17 from "../images/staff/staff17.png"
import staff18 from "../images/staff/staff18.png"
import staff19 from "../images/staff/staff19.png"
import staff20 from "../images/staff/staff20.png"
import staff21 from "../images/staff/staff21.png"
import staff22 from "../images/staff/staff22.png"
import staff23 from "../images/staff/staff23.png"
import staff24 from "../images/staff/staff24.png"
import staff25 from "../images/staff/staff25.png"
import staff26 from "../images/staff/staff26.png"

import maternal from "../images/maternal.jpg";
import jardin from "../images/jardin.jpg";
import primaria from "../images/primaria.jpg";
import "./Home.css";

export default function Home() {
    const carouselImages = [img0, img1, img2, img4, img7, img8, img9, img10, img11,img13, img14, img15];
    const babyIcon = (
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
            className="lucide lucide-baby-icon lucide-baby"
            style={{ color: "var(--secondary)" }}
            aria-hidden="true"
        >
            <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
            <path d="M15 12h.01" />
            <path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
            <path d="M9 12h.01" />
        </svg>
    );
    const bookIcon = (
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
            className="lucide lucide-book-open-text-icon lucide-book-open-text"
            style={{ color: "var(--secondary)" }}
            aria-hidden="true"
        >
            <path d="M12 7v14" />
            <path d="M16 12h2" />
            <path d="M16 8h2" />
            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
            <path d="M6 12h2" />
            <path d="M6 8h2" />
        </svg>
    );
    const paletteIcon = (
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
            className="lucide lucide-palette-icon lucide-palette"
            style={{ color: "var(--secondary)" }}
            aria-hidden="true"
        >
            <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />
            <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
        </svg>
    );
    const sparklesIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-sparkles-icon lucide-sparkles"
            style={{ color: "var(--accent)" }}
            aria-hidden="true"
        >
            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
            <path d="M20 2v4" />
            <path d="M22 4h-4" />
            <circle cx="4" cy="20" r="2" />
        </svg>
    );

    const staffDirectivo = [
        {
            name: "Marianela Ayeray Suárez",
            role: "Propietaria y representante legal",
            image: staff1
        },
        {
            name: "Alejandra López",
            role: "Directora",
            image: staff0
        },
        {
            name: "Maia Alfaro",
            role: "Secretaria",
            image: staff2
        }
    ];

    const staffInicial = [
        {
            name: "Jessica Cañete",
            grade: "Nivel Inicial - Maternal",
            image: staff13
        },
        {
            name: "Daiana Campos",
            grade: "Nivel Inicial - Sala de 2 y 3 años",
            image: staff14
        },
        {
            name: "Araceli Fuentes",
            grade: "Nivel Inicial - Sala de 4 años",
            image: staff8
        },
        {
            name: "Mónica Jara",
            grade: "Nivel Inicial - Sala de 5 años",
            image: staff11
        },
        {
            name: "Romina Cisterna",
            grade: "Nivel Inicial - Preceptora",
            image: staff20
        },
        {
            name: "Alejandra Yezzi",
            grade: "Nivel Inicial - Preceptora",
            image: staff10
        }

    ];

    const staffPrimaria = [
        {
            name: "Barbara Flores",
            grade: "Primaria - 1er grado",
            image: staff25
        },
        {
            name: "Carolina Ortega",
            grade: "Primaria - 2do grado A",
            image: staff21
        },
        {
            name: "Macarena Yevenes",
            grade: "Primaria - 2do grado B",
            image: staff9
        },
        {
            name: "Verónica García",
            grade: "Primaria - 3er grado",
            image: staff15
        },
        {
            name: "Alejandra López",
            grade: "Primaria - 4to grado",
            image: staff0
        },
        {
            name: "Karina Martinez Aseguín",
            grade: "Primaria - 5to grado",
            image: staff5
        },
        {
            name: "Rosa Cerdá",
            grade: "Primaria - 6to grado",
            image: staff17
        },
        {
            name: "Elvio García",
            grade: "Primaria - 7mo grado",
            image: staff7
        }
    ];

    const staffTalleres = [
        {
            name: "Javier Troncoso",
            grade: "Música",
            image: staff6
        },
        {
            name: "Matías Britos",
            grade: "Informática",
            image: staff26
        },
        {
            name: "Gabriela Nicastro",
            grade: "Inglés",
            image: staff19
        },
        {
            name: "Cinthia Corradini",
            grade: "Cocina",
            image: staff12
        },
        {
            name: "Laura Martínez",
            grade: "Yoga",
            image: staff18
        },
        {
            name: "Jorge Pino",
            grade: "Folklore",
            image: staff16
        },
        {
            name: "Rocío Salazar", 
            grade: "Manualidades y reciclado",
            image: staff23
        },
        {
            name: "Adrián Salas",
            grade: "Instrumentos musicales",
            image: staff3
        },
        {
            name: "Yamila Espinosa",
            grade: "Educación Física",
            image: staff4
        },
        {
            name: "Agustina Rodríguez",
            grade: "Educación Física",
            image: staff22
        },
        {
            name: "Natalia Soria",
            grade: "Plástica",
            image: staff24
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
                            icon={babyIcon}
                            title="Maternal" 
                            frontText="Estimulación temprana"
                            backText="Primeros vínculos y desarrollo sensorial en un ambiente seguro y cálido."
                        />
                        <FlipCard 
                            icon={paletteIcon}
                            title="Jardín" 
                            frontText="Juego y creatividad"
                            backText="Aprendizaje a través del juego, desarrollando habilidades sociales."
                        />
                        <FlipCard 
                            icon={bookIcon}
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
                            icon={babyIcon}
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
                            icon={paletteIcon}
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
                            icon={bookIcon}
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
                            <span className="special-workshops-emoji">{sparklesIcon}</span>
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
                            <h4 className="staff-subtitle">Especiales</h4>
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