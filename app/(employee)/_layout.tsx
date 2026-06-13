// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/use-color-scheme';


export default function RootLayout() {

    return (
        <Stack>
            <Stack.Screen name="employeeList" options={{ headerShown: true, headerTitle: "Manage Employees", headerStyle: { backgroundColor: "#58276D" } }} />
            <Stack.Screen name="newEmployee" options={{ headerShown: true, headerTitle: "New Employees", headerStyle: { backgroundColor: "#58276D" } }} />
            <Stack.Screen name="updateEmployee" options={{ headerShown: true, headerTitle: "Update Employee", headerStyle: { backgroundColor: "#58276D" }, headerTintColor: "#fff" }} />
        </Stack>
    );
}
