import React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router } from "expo-router";
import { useLogin } from "@/hooks/useAuth"

import FormInput from "@/components/FormInput";

const PURPLE = "#58276D";
const LIGHT_BG = "#F5F5F5";
const ORANGE = "#E8960C";

// ── Schema ──────────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ── Screen ──────────────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutateAsync: login } = useLogin();
  

  const onSubmit = async (data: LoginFormData) => {
    try {
      Alert.alert("Login", "Logging in...");
      await login({ username: data.email, password: data.password });
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Heading */}
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.subheading}>Sign in to your account</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Form Card */}
        <View style={styles.card}>
          <FormInput
            name="email"
            label="Email"
            control={control}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormInput
            name="password"
            label="Password"
            control={control}
            placeholder="******"
            secureTextEntry={true}
          />

          {/* Forgot password */}
          <TouchableOpacity
            style={styles.forgotContainer}
            onPress={() => {/* TODO: navigate to forgot password */}}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.primaryButton, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>
            {isSubmitting ? "Signing in..." : "Login"}
          </Text>
        </TouchableOpacity>

        {/* Redirect to Signup */}
        <View style={styles.redirectRow}>
          <Text style={styles.redirectLabel}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text style={styles.redirectLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headingContainer: {
    backgroundColor: "#FFFFFF",
    paddingTop: 24,
    paddingBottom: 8,
    alignItems: "center",
  },
  heading: {
    fontSize: 38,
    fontWeight: "700",
    color: ORANGE,
    textAlign: "center",
  },
  subheading: {
    fontSize: 15,
    color: "#888",
    marginTop: 4,
    textAlign: "center",
  },
  scroll: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // ── Form Card ─────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 28,
    marginTop: 16,
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: 4,
  },
  forgotText: {
    color: PURPLE,
    fontSize: 13,
    fontWeight: "600",
  },

  // ── Primary Button ────────────────────────────────────────────────────────────
  primaryButton: {
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 20,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  // ── Redirect Row ──────────────────────────────────────────────────────────────
  redirectRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  redirectLabel: {
    color: "#666",
    fontSize: 14,
  },
  redirectLink: {
    color: PURPLE,
    fontSize: 14,
    fontWeight: "700",
  },
});