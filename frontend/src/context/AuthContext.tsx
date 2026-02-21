import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authEvents } from "../api/eventEmitter";

type AuthContextType = {
    token: string | null;
    role: string | null;
    rememberMe: boolean;
    login: (token: string, role: string, rememberMe: boolean) => void;
    logout: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEYS = {
    TOKEN: "auth_token",
    ROLE: "auth_role",
    REMEMBER_ME: "auth_rememberMe"
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    // Inicializar desde almacenamiento
    useEffect(() => {
        const initializeAuth = () => {
            // Primero revisar localStorage (rememberMe)
            const savedRememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
            const isRemembered = savedRememberMe ? JSON.parse(savedRememberMe) : false;
            
            let storedToken: string | null = null;
            let storedRole: string | null = null;

            if (isRemembered) {
                // Si está marcado rememberMe, usar localStorage
                storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
                storedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
            } else {
                // Si no, usar sessionStorage
                storedToken = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
                storedRole = sessionStorage.getItem(STORAGE_KEYS.ROLE);
            }

            if (storedToken && storedRole) {
                setToken(storedToken);
                setRole(storedRole);
                setRememberMe(isRemembered);
            }

            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = (newToken: string, newRole: string, newRememberMe: boolean) => {
        setToken(newToken);
        setRole(newRole);
        setRememberMe(newRememberMe);

        if (newRememberMe) {
            // Guardar en localStorage si rememberMe está marcado
            localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
            localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
            localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, JSON.stringify(true));
            // Limpiar sessionStorage
            sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
            sessionStorage.removeItem(STORAGE_KEYS.ROLE);
        } else {
            // Guardar en sessionStorage si no está marcado
            sessionStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
            sessionStorage.setItem(STORAGE_KEYS.ROLE, newRole);
            // Limpiar localStorage
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.ROLE);
            localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
        }
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        setRememberMe(false);

        // Limpiar ambos tipos de almacenamiento
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ROLE);
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.ROLE);
    };

    // Escuchar eventos de logout (ej: 401 response)
    useEffect(() => {
        const unsubscribe = authEvents.subscribe(() => {
            logout();
            // La redirección se maneja en ProtectedRoute
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ token, role, rememberMe, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
