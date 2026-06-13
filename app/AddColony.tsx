import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { useCreateColony } from '@/hooks/useColony';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import FormInput from "@/components/FormInput";

const PURPLE = "#58276D";
const LIGHT_BG = "#F5F5F5";
const ORANGE = "#E8960C";

// ── Schema ─────────────────────────────────────────────────────────────────────
const newColonySchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  phone: z.string().min(1, "Phone number is required"),
  sensorInfo: z.string().min(1, "It is required"),
  password: z.string().min(1, "Password is required"),
});

type NewColonyFormData = z.infer<typeof newColonySchema>;


// ── Screen ─────────────────────────────────────────────────────────────────────
export default function AddColonyScreen() {
  const { mutateAsync: createColony } = useCreateColony();
  const { deviceId, sensors, isActive } = useLocalSearchParams<{
    deviceId?: string;
    sensors?: string;
    isActive?: string;
  }>();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NewColonyFormData>({
    resolver: zodResolver(newColonySchema),
    defaultValues: {
      name: "",
      location: "",
      sensorInfo: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: NewColonyFormData) => {
    try {
      // Parse sensors param or use default sensors if not provided
      let parsedSensors: string[] = [];
      if (sensors) {
        try {
          parsedSensors = JSON.parse(sensors);
        } catch {
          parsedSensors = typeof sensors === 'string' ? sensors.split(',') : [];
        }
      }

      if (parsedSensors.length < 1) {

      }

      const sensorMapping: Record<string, { name: string; type: string; max_value: number; min_value: number }> = {
        Temperature: { name: 'DHT 22', type: 'temperature', max_value: 35, min_value: 10 },
        Humidity: { name: 'DHT 22', type: 'humidity', max_value: 35, min_value: 10 },
        Camera: { name: 'Camera', type: 'camera', max_value: 35, min_value: 10 },
        Weight: { name: 'Load cell 1', type: 'weight', max_value: 35, min_value: 10 },
      };

      const mappedSensors = parsedSensors.length > 0
        ? parsedSensors.map(sensorKey => {
          const map = sensorMapping[sensorKey] || { name: `${sensorKey} Sensor`, type: sensorKey.toLowerCase(), max_value: 35, min_value: 10 };
          return {
            name: map.name,
            max_value: map.max_value,
            min_value: map.min_value,
            type: map.type,
            description: data.sensorInfo,
          };
        })
        : [];

      // Map form fields → API body structure
      const payload = {
        name: data.name,
        location: data.location,
        description: data.sensorInfo,   // sensorInfo used as description
        controller: {
          id: uuidv4(),      // use the passed deviceId, fallback to generated uuid
          is_active: isActive !== undefined ? isActive === 'true' : true,
          type: 'arduino',               // default type
        },
        sensors: mappedSensors,
      };

      await createColony(payload);
      router.replace("/Colonies");
    } catch (error: any) {
      console.error('Create colony failed:', error?.response?.data || error.message);
      // show error to user — e.g. Alert.alert('Error', 'Failed to create colony')
      Alert.alert('Error', error?.response?.data?.message || 'Failed to create colony');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={{ backgroundColor: "white" }}>
        <Text style={{ fontSize: 40, fontWeight: "700", color: ORANGE, textAlign: "center" }}>Add Colony Info</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Form Card */}
        <View style={styles.card}>
          <FormInput
            name="name"
            label="Name"
            control={control}
            placeholder="Abdur Rehman"
          />
          <FormInput
            name="location"
            label="Location"
            control={control}
            placeholder="Khanna 1"
          />
          <FormInput
            name="sensorInfo"
            label="Sensor Information"
            control={control}
            placeholder="House 123, Block 1"
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
            name="password"
            label="Password"
            control={control}
            placeholder="******"
            secureTextEntry={true}
          />
        </View>


        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? "Saving..." : "Save Data"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: PURPLE,
  },
  header: {
    backgroundColor: PURPLE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: {
    marginRight: 8,
  },
  backArrow: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "300",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // ── Form Card ────────────────────────────────────────────────────────────────
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
  },
  phonePrefix: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginRight: 4,
  },

  // ── Role ─────────────────────────────────────────────────────────────────────
  roleTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: PURPLE,
    textAlign: "center",
    marginBottom: 20,
  },
  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 32,
  },
  roleChip: {
    backgroundColor: "#F5E6C8",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  roleChipSelected: {
    backgroundColor: PURPLE,
  },
  roleChipText: {
    color: "#5A4010",
    fontSize: 14,
    fontWeight: "500",
  },
  roleChipTextSelected: {
    color: "#FFFFFF",
  },

  // ── Save Button ───────────────────────────────────────────────────────────────
  saveButton: {
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});