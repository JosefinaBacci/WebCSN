import { useState, useEffect } from "react";
import "./ImageCarousel.css";

interface CarouselProps {
    images: string[];
    title: string;
}

export default function ImageCarousel({ images, title }: CarouselProps) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    const goToSlide = (index: number) => {
        setCurrent(index);
    };

    return (
        <div className="carousel-container">
            <h2>{title}</h2>
            <div className="carousel">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`carousel-slide ${index === current ? "active" : ""}`}
                    >
                        <img src={image} alt={`Slide ${index}`} />
                    </div>
                ))}
            </div>
            <div className="carousel-dots">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === current ? "active" : ""}`}
                        aria-label={`Ir a la imagen ${index + 1}`}
                        aria-current={index === current}
                        onClick={() => goToSlide(index)}
                    >
                        <span className="dot-icon" aria-hidden="true">
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
                                className="lucide lucide-dot"
                            >
                                <circle cx="12.1" cy="12.1" r="1" />
                            </svg>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
