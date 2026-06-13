import { z } from "zod";

export const colonySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  location: z.string().min(3, "Location is required"),
  sensor: z.string().min(3, "Sensor ID is required"),
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

export type ColonyFormData = z.infer<typeof colonySchema>;