import type { ReactNode } from "react";
import "./SectionCard.css";

interface SectionCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    features: string[];
    image: string;
}

export default function SectionCard({ icon, title, description, features, image }: SectionCardProps) {
    return (
        <div className="section-card">
            <div className="section-card-image">
                <img src={image} alt={title} />
                <div className="section-card-icon">{icon}</div>
            </div>
            <div className="section-card-content">
                <h3>{title}</h3>
                <p className="section-card-description">{description}</p>
                <ul className="section-card-features">
                    {features.map((feature, index) => (
                        <li key={index}>
                            <span className="feature-check">✓</span>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
