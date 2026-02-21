import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { token, role, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <p>Cargando...</p>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
