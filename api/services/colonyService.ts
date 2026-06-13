import apiClient from '../client';

export const colonyService = {
    getAll: (params) => apiClient.get('/hardware/colony/list', { params }).then(r => r.data),
    getById: (id: string) => apiClient.get(`/hardware/colony/${id}`).then(r => r.data),

    create: (payload: {
        name: string;
        location: string;
        description: string;
        controller: { id: string; is_active: boolean; type: string };
        sensors: { name: string; max_value: number; min_value: number; type: string; description: string }[];
    }) => apiClient.post('/hardware/colony/create/', payload).then(r => r.data),
    
    // update: (id, body) => apiClient.put(`/users/${id}`, body).then(r => r.data),
    // delete: (id) => apiClient.delete(`/users/${id}`).then(r => r.data),
};