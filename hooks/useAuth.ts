import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { authService, LoginPayload, RegisterPayload } from '@/api/services/authService';

export const useRegister = () =>
  useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: () => {
      router.replace('/(tabs)');
    },
  });

export const useLogin = () =>
  useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: () => {
      router.replace('/(tabs)');
    },
  });

export const useLogout = () =>
  useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      router.replace('/(auth)/login');
    },
  });