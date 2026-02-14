import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Layout.css";

export default function Layout() {
    return (
        <div className="layout-container">
            <Navbar />
            <main className="layout-main">
                <Outlet />
            </main>
            <footer className="layout-footer">
                <p>&copy; 2026 Colegio CSN. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}