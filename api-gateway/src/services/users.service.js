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

export function getApproved(token) {
    return axios.get(`${USERS_URL}/users/approved`, {
        headers: {
            Authorization: token
        }
    });
}

export function getRejected(token) {
    return axios.get(`${USERS_URL}/users/rejected`, {
        headers: {
            Authorization: token
        }
    });
}

export function getUserStatusHistory(userId, token) {
    return axios.get(`${USERS_URL}/users/${userId}/history`, {
        headers: {
            Authorization: token
        }
    });
}

export function getAllStatusHistory(token, page = 1, limit = 20) {
    return axios.get(`${USERS_URL}/users/admin/history-all?page=${page}&limit=${limit}`, {
        headers: {
            Authorization: token
        }
    });
}

export function updateUserStatus(userId, data, token) {
    return axios.patch(`${USERS_URL}/users/${userId}/status`, data, {
        headers: {
            Authorization: token
        }
    });
}

export function approve(id, token) {
    return axios.patch(`${USERS_URL}/users/${id}/approve`, {}, {
        headers: {
            Authorization: token
        }
    });
}

export function reject(id, token) {
    return axios.patch(`${USERS_URL}/users/${id}/reject`, {}, {
        headers: {
            Authorization: token
        }
    });
}
