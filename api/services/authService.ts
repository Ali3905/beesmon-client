import apiClient from '../client';
import { tokenStorage } from '../../utils/tokenStorage';
import { Alert } from 'react-native';

export interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  address: string;
  phone_number: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  // extend with whatever your API returns (e.g. user object)
}

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/account/register/', payload);
    await tokenStorage.setToken(data.token);
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/account/login/', payload);
    console.log('Login', 'Login stop here');
    
    await tokenStorage.setToken(data.token);
    return data;
  },

  logout: async (): Promise<void> => {
    await tokenStorage.removeToken();
  },
};