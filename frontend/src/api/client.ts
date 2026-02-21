import { authEvents } from "./eventEmitter";

const API_URL = import.meta.env.VITE_API_URL;

interface FetchOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}

class ApiCallError extends Error {
    statusCode: number;
    statusText: string;

    constructor(statusCode: number, statusText: string, message: string) {
        super(message);
        this.name = 'ApiCallError';
        this.statusCode = statusCode;
        this.statusText = statusText;
    }
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

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) {
            authEvents.emit();
            throw new ApiCallError(
                401,
                response.statusText,
                "Sesión expirada. Por favor, inicia sesión de nuevo."
            );
        }

        if (!response.ok) {
            throw new ApiCallError(
                response.status,
                response.statusText,
                `Error: ${response.status} ${response.statusText}`
            );
        }

        return response.json();
    } catch (error) {
        if (error instanceof ApiCallError) {
            throw error;
        }
        throw new Error(`Error en la llamada API: ${error instanceof Error ? error.message : 'Desconocido'}`);
    }
}
