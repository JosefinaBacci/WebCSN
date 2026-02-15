import axios from "axios";

const USERS_URL = process.env.USERS_SERVICE_URL;

export function register(data) {
    return axios.post(`${USERS_URL}/users/register`, data);
}

export function getPending(token) {
    return axios.get(`${USERS_URL}/users/pending`, {
        headers: {
            Authorization: token
        }
    });
}

export function approve(id) {
    return axios.patch(`${USERS_URL}/users/${id}/approve`);
}

export function reject(id) {
    return axios.patch(`${USERS_URL}/users/${id}/reject`);
}
