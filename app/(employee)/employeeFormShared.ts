import { StyleSheet } from "react-native";
import { z } from "zod";

export const PURPLE = "#58276D";
export const LIGHT_BG = "#F5F5F5";
export const ORANGE = "#E8960C";

export const employeeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;

export const ROLES = [
  "Collect Honey",
  "Health manager",
  "Hive cleaner",
  "Swarm controller",
] as const;

/** Strip +92 / 92 prefix so the form matches newEmployee (local digits only). */
export function phoneToFormValue(phone: string | undefined | null): string {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length >= 11 && digits.startsWith("92")) {
    return digits.slice(2);
  }
  if (digits.length >= 12 && digits.startsWith("92")) {
    return digits.slice(2);
  }
  return digits;
}

export const employeeFormStyles = StyleSheet.create({
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
    marginBottom: 28,
  },
  phonePrefix: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginRight: 4,
  },

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

  centerMessage: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  centerMessageText: {
    color: "#333",
    fontSize: 15,
    textAlign: "center",
  },
});
