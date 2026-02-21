import { authEvents } from "./eventEmitter";

const API_URL = import.meta.env.VITE_API_URL;

interface FetchOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}

export async function apiCall<T>(
    endpoint: string,
    token: string,
    options: FetchOptions = {}
): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        authEvents.emit(); 
        throw new Error("Sesión expirada. Por favor, inicia sesión de nuevo.");
    }

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}
