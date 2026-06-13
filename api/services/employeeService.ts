import { Alert } from "react-native";
import apiClient from "../client";

export const employeeService = {
    getById: (id: string) => apiClient.get(`/account/user/employee/${id}`).then(r => r.data),
    getAll: () => apiClient.get(`/account/user/employee/list/`).then(r => r.data),
    create: (payload: {
        name: string;
        role: string;
        phone_number: string;
        email: string;
    }) => apiClient.post(`/account/user/employee/create/`, payload).then(r => r.data),

    update: (
        id: string,
        payload: {
            name: string;
            role: string;
            phone_number: string;
            email: string;
        }
    ) => apiClient.put(`/account/user/employee/${id}/`, payload).then((r) => r.data),

    delete: (id: string) =>
        apiClient
            .delete(`/account/user/employee/${id}/`)
            .then((r) => r.data ?? true),
};