import { apiCall } from "./client";

interface User {
    _id: string;
    email: string;
    profile?: {
        name: string;
        lastname: string;
        children?: Array<{ name: string; grade: string }>;
    };
}

interface HistoryEntry {
    _id: string;
    userId: string;
    email: string;
    previousStatus: "pending" | "approved" | "rejected";
    newStatus: "pending" | "approved" | "rejected";
    changedBy: string;
    reason?: string;
    changedAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}

interface HistoryResponse {
    data: HistoryEntry[];
    pagination: Pagination;
}

export const userService = {
    getPending: (token: string): Promise<User[]> =>
        apiCall<User[]>("/users/pending", token),

    getApproved: (token: string): Promise<User[]> =>
        apiCall<User[]>("/users/approved", token),

    getRejected: (token: string): Promise<User[]> =>
        apiCall<User[]>("/users/rejected", token),

    getStatusHistory: (userId: string, token: string): Promise<HistoryEntry[]> =>
        apiCall<HistoryEntry[]>(`/users/${userId}/history`, token),

    getAllStatusHistory: (token: string, page: number = 1, limit: number = 20): Promise<HistoryResponse> =>
        apiCall<HistoryResponse>(`/users/admin/history-all?page=${page}&limit=${limit}`, token),

    approveUser: (userId: string, token: string, reason?: string): Promise<void> =>
        apiCall<void>(`/users/${userId}/approve`, token, {
            method: "PATCH",
            body: JSON.stringify({ reason })
        }),

    rejectUser: (userId: string, token: string, reason?: string): Promise<void> =>
        apiCall<void>(`/users/${userId}/reject`, token, {
            method: "PATCH",
            body: JSON.stringify({ reason })
        }),

    updateUserStatus: (
        userId: string,
        newStatus: "approved" | "rejected" | "pending",
        token: string,
        reason?: string
    ): Promise<void> =>
        apiCall<void>(`/users/${userId}/status`, token, {
            method: "PATCH",
            body: JSON.stringify({ newStatus, reason })
        })
};
