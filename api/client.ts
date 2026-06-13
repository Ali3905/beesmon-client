// src/api/client.js
import axios from 'axios';
import { tokenStorage } from '../utils/tokenStorage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
    baseURL: "https://ali30905.pythonanywhere.com",
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// attach token
apiClient.interceptors.request.use(async (config) => {
    const token = await tokenStorage.getToken();

    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }

    console.log('🚀 REQUEST:', {
        method: config.method?.toUpperCase(),
        url: config?.baseURL || "" + config.url,
        headers: config.headers,
        params: config.params,
        body: config.data,
    });

    return config;
});

// handle unauthorized
apiClient.interceptors.response.use(
    (response) => {
        console.log('✅ RESPONSE:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
        });
        return response;
    },
    (error) => {
        console.log('❌ ERROR:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.message,
            data: error.response?.data,
            error: error,
        });
        return Promise.reject(error);
    }
);

export default apiClient;