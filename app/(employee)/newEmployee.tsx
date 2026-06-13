import React from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";

import FormInput from "@/components/FormInput";
import { useCreateEmployee } from "@/hooks/useEmployee";
import {
  PURPLE,
  ROLES,
  employeeFormSchema,
  employeeFormStyles as styles,
  type EmployeeFormData,
} from "./employeeFormShared";

export default function NewEmployeeScreen() {
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  const { mutateAsync: createEmployee } = useCreateEmployee();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    if (!selectedRole) return;
    const payload = {
      name: data.name,
      phone_number: data.phone,
      email: data.email,
      role: selectedRole,
    };
    await createEmployee(payload);
    router.back();
  };

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
          style={[styles.saveButton, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
