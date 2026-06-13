import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { tokenStorage } from '@/utils/tokenStorage';

export const unstable_settings = {
  anchor: '(tabs)',
  initialRouteName: '(tabs)',
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

function AppContent() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await tokenStorage.getToken();
        const inAuthGroup = segments[0] === '(auth)';

        if (!token && !inAuthGroup) {
          router.replace('/(auth)/login');
        } else if (token && inAuthGroup) {
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
      }
    };
    checkAuth();
  }, [segments]);

  return (
    <Stack initialRouteName='(tabs)'>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(colony)/[id]" options={{ headerShown: true, headerTitleAlign: "center", headerTintColor: "#fff", headerStyle: { backgroundColor: "#f38b15" } }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      <Stack.Screen name="Colonies" options={{ headerShown: false }} />
      <Stack.Screen name="RegisterDevice" options={{ headerShown: false }} />
      <Stack.Screen name="AddColony" options={{ headerShown: false }} />
      <Stack.Screen name="Profile" options={{ headerShown: false }} />
      <Stack.Screen name="(employee)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
      {/* <StatusBar style="auto" /> */}
    </ThemeProvider>
  );
}
