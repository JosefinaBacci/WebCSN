import axios from "axios";

const AUTH_URL = process.env.AUTH_SERVICE_URL;

if (!AUTH_URL) {
    console.error("ERROR: AUTH_SERVICE_URL no está configurada");
}

export function login(data) {
    console.log(`Intentando login en: ${AUTH_URL}/auth/login`);
    return axios.post(`${AUTH_URL}/auth/login`, data, {
        timeout: 10000
    });
}
