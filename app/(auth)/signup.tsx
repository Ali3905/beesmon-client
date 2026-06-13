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
import { useRegister } from "@/hooks/useAuth"

import FormInput from "@/components/FormInput";

const PURPLE = "#58276D";
const LIGHT_BG = "#F5F5F5";
const ORANGE = "#E8960C";

// ── Schema ──────────────────────────────────────────────────────────────────────
const signupSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

// ── Screen ──────────────────────────────────────────────────────────────────────
export default function SignupScreen() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync: register } = useRegister();

  const onSubmit = async (data: SignupFormData) => {
    try {
      await register({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        address: data.address,
        phone_number: data.phone,
      });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Heading */}
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subheading}>Register to get started</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Form Card */}
        <View style={styles.card}>
          <FormInput
            name="first_name"
            label="First Name"
            control={control}
            placeholder="Abdur"
          />
          <FormInput
            name="last_name"
            label="Last Name"
            control={control}
            placeholder="Rehman"
          />
          <FormInput
            name="email"
            label="Email"
            control={control}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormInput
            name="phone"
            label="Phone Number"
            control={control}
            keyboardType="phone-pad"
            placeholder="310 0800892"
            prefix={<Text style={styles.phonePrefix}>🇵🇰 +92</Text>}
          />
          <FormInput
            name="address"
            label="Address"
            control={control}
            placeholder="Block # 3, House 2"
          />
          <FormInput
            name="password"
            label="Password"
            control={control}
            placeholder="******"
            secureTextEntry={true}
          />
          <FormInput
            name="confirmPassword"
            label="Confirm Password"
            control={control}
            placeholder="******"
            secureTextEntry={true}
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.primaryButton, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        {/* Redirect to Login */}
        <View style={styles.redirectRow}>
          <Text style={styles.redirectLabel}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.redirectLink}>Login</Text>
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
  phonePrefix: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginRight: 4,
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