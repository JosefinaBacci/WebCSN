import { createContext, useContext, useState, useEffect } from "react";
import { authEvents } from "../api/eventEmitter";

type AuthContextType = {
    token: string | null;
    role: string | null;
    rememberMe: boolean;
    login: (token: string, role: string, rememberMe: boolean) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [role, setRole] = useState<string | null>(() => localStorage.getItem("role"));
    const [rememberMe, setRememberMe] = useState<boolean>(() => {
        const saved = localStorage.getItem("rememberMe");
        return saved ? JSON.parse(saved) : false;
    });

    const login = (newToken: string, newRole: string, newRememberMe: boolean) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("role", newRole);
        localStorage.setItem("rememberMe", JSON.stringify(newRememberMe));
        setToken(newToken);
        setRole(newRole);
        setRememberMe(newRememberMe);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("rememberMe");
        setToken(null);
        setRole(null);
        setRememberMe(false);
    };

    useEffect(() => {
        if (!rememberMe) {
            return authEvents.subscribe(logout);
        }
    }, [rememberMe]);

    return (
        <AuthContext.Provider value={{ token, role, rememberMe, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
