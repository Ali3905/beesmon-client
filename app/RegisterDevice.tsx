import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  StatusBar,
  Image,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router } from "expo-router";
import Feather from '@expo/vector-icons/Feather';

import FormInput from "@/components/FormInput";

const PURPLE = "#58276D";
const LIGHT_BG = "#F5F5F5";
const ORANGE = "#E8960C";

const registerSchema = z.object({
  deviceId: z.string().regex(/^SA-\d{4,}$/, "Invalid ID format"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const SENSORS = ["Temperature", "Humidity", "Camera", "Weight"];

export default function RegisterDeviceScreen() {
  const [step2Visible, setStep2Visible] = useState(false);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);

  const {
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      deviceId: "",
    },
    mode: "onChange",
  });

  const handleRegister = async () => {
    const isValid = await trigger("deviceId");
    if (isValid) {
      setStep2Visible(true);
    } else {
      setStep2Visible(false);
    }
  };

  const toggleSensor = (sensor: string) => {
    setSelectedSensors((prev) => {
      const isSelected = prev.includes(sensor);
      if (isSelected) {
        return prev.filter((s) => s !== sensor);
      } else {
        return [...prev, sensor];
      }
    });
  };

  const handleNext = () => {
    if (selectedSensors.length === 0) {
      Alert.alert("Validation Error", "Please select at least one sensor.");
      return;
    }
    const deviceId = getValues("deviceId");
    router.push({
      pathname: "/AddColony",
      params: {
        deviceId,
        sensors: JSON.stringify(selectedSensors),
        isActive: isActive.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          {/* <Text style={styles.backArrow}>←</Text> */}
          <Feather name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register Device</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step 1 — Enter Device ID */}
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image
              source={require("@/assets/images/microcontroller.png")}
              style={styles.microcontrollerImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <View style={{ flex: 1 }}>
                <FormInput
                  name="deviceId"
                  label="Microcontroller ID"
                  control={control}
                  placeholder="SA-"
                />
              </View>
              <TouchableOpacity
                onPress={() => Alert.alert("Scan", "Camera scanning is not implemented yet.")}
                style={styles.scanButton}
              >
                <Text style={styles.scanButtonText}>Scan now</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.hintText}>Example: SA-0012345</Text>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            activeOpacity={0.85}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Step 2 — Sensor Selection */}
        {step2Visible && (
          <View style={styles.card}>
            <Text style={styles.roleTitle}>Sensors Installed</Text>
            
            <View style={styles.rolesContainer}>
              {SENSORS.map((sensor) => {
                const isSelected = selectedSensors.includes(sensor);
                return (
                  <TouchableOpacity
                    key={sensor}
                    style={[styles.roleChip, isSelected && styles.roleChipSelected]}
                    onPress={() => toggleSensor(sensor)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.roleChipText, isSelected && styles.roleChipTextSelected]}>
                      {sensor}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 3 — Activate toggle & Navigation */}
        {step2Visible && selectedSensors.length > 0 && (
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Activate</Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: "#D3D3D3", true: "#F5E6C8" }}
                thumbColor={isActive ? ORANGE : "#f4f3f4"}
              />
            </View>

            <TouchableOpacity
              style={styles.outlinedButton}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.outlinedButtonText}>Add Colony Info</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PURPLE,
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
    marginLeft: 8,
  },
  scroll: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  imageContainer: {
    height: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  microcontrollerImage: {
    width: "90%",
    height: "90%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  scanButton: {
    marginBottom: 26,
    marginLeft: 12,
  },
  scanButtonText: {
    color: PURPLE,
    fontSize: 15,
    fontWeight: "700",
  },
  hintText: {
    color: "#777777",
    fontSize: 13,
    marginTop: -8,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 20,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: PURPLE,
    marginBottom: 16,
  },
  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    color: ORANGE,
    fontSize: 18,
    fontWeight: "700",
  },
  outlinedButton: {
    borderWidth: 2,
    borderColor: PURPLE,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 20,
  },
  outlinedButtonText: {
    color: PURPLE,
    fontSize: 18,
    fontWeight: "700",
  },
});
