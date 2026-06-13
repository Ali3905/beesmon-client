import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
    getToken: async (): Promise<string | null> => {
        if (Platform.OS === 'web') {
            try {
                return localStorage.getItem(TOKEN_KEY);
            } catch (e) {
                console.error('Error reading token from localStorage:', e);
                return null;
            }
        }
        return SecureStore.getItemAsync(TOKEN_KEY);
    },
    setToken: async (token: string): Promise<void> => {
        if (Platform.OS === 'web') {
            try {
                localStorage.setItem(TOKEN_KEY, token);
            } catch (e) {
                console.error('Error writing token to localStorage:', e);
            }
            return;
        }
        return SecureStore.setItemAsync(TOKEN_KEY, token);
    },
    removeToken: async (): Promise<void> => {
        if (Platform.OS === 'web') {
            try {
                localStorage.removeItem(TOKEN_KEY);
            } catch (e) {
                console.error('Error removing token from localStorage:', e);
            }
            return;
        }
        return SecureStore.deleteItemAsync(TOKEN_KEY);
    },
};