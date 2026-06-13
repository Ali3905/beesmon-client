import React, { useEffect } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";

import FormInput from "@/components/FormInput";
import { useEmployeeById, useUpdateEmployee } from "@/hooks/useEmployee";
import {
  PURPLE,
  ROLES,
  employeeFormSchema,
  employeeFormStyles as styles,
  phoneToFormValue,
  type EmployeeFormData,
} from "./employeeFormShared";

export default function UpdateEmployeeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const employeeId = typeof id === "string" ? id : id?.[0] ?? "";

  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  const { data, isLoading, isError, error } = useEmployeeById(employeeId);
  const { mutateAsync: updateEmployee, isPending } = useUpdateEmployee();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!data) return;

    const raw = data as Record<string, unknown>;
    const name = (raw.name as string) ?? "";
    const email = (raw.email as string) ?? "";
    const role = (raw.role as string) ?? null;
    const phoneRaw =
      (raw.phone_number as string) ??
      (raw.phone as string) ??
      "";

    reset({
      name,
      phone: phoneToFormValue(phoneRaw),
      email,
    });
    setSelectedRole(role);
  }, [data, reset]);

  const onSubmit = async (form: EmployeeFormData) => {
    if (!selectedRole || !employeeId) return;
    await updateEmployee({
      id: employeeId,
      payload: {
        name: form.name,
        phone_number: form.phone,
        email: form.email,
        role: selectedRole,
      },
    });
    router.back();
  };

  const busy = isSubmitting || isPending;

  if (!employeeId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={PURPLE} />
        <View style={styles.centerMessage}>
          <Text style={styles.centerMessageText}>Missing employee id.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={PURPLE} />
        <View style={[styles.centerMessage, { flex: 1 }]}>
          <ActivityIndicator size="large" color={PURPLE} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={PURPLE} />
        <View style={styles.centerMessage}>
          <Text style={styles.centerMessageText}>
            {error instanceof Error ? error.message : "Could not load employee."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <FormInput
            name="name"
            label="Name"
            control={control}
            placeholder="Abdur Rehman"
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
            name="email"
            label="Email"
            control={control}
            keyboardType="email-address"
            placeholder="manikhan5353@gmail.com"
          />
        </View>

        <Text style={styles.roleTitle}>Role</Text>

        <View style={styles.rolesContainer}>
          {ROLES.map((role) => {
            const isSelected = selectedRole === role;
            return (
              <TouchableOpacity
                key={role}
                style={[styles.roleChip, isSelected && styles.roleChipSelected]}
                onPress={() => setSelectedRole(role)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.roleChipText,
                    isSelected && styles.roleChipTextSelected,
                  ]}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, busy && { opacity: 0.7 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={busy}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>
            {busy ? "Updating..." : "Update"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
