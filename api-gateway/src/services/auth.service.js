import axios from "axios";

const AUTH_URL = process.env.AUTH_SERVICE_URL;

export function login(data) {
    return axios.post(`${AUTH_URL}/auth/login`, data);
}
