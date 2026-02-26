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
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
}
