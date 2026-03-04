import type { ReactNode } from "react";
import "./FlipCard.css";

interface FlipCardProps {
    icon: ReactNode;
    title: string;
    frontText: string;
    backText: string;
}

export default function FlipCard({ icon, title, frontText, backText }: FlipCardProps) {
    return (
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <div className="flip-icon">{icon}</div>
                    <h3>{title}</h3>
                    <p>{frontText}</p>
                </div>
                <div className="flip-card-back">
                    <p>{backText}</p>
                </div>
            </div>
        </div>
    );
}
