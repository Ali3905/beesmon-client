import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Control, Controller } from "react-hook-form";

const PURPLE = "#58276D";

interface Props {
  name: string;
  label: string;
  control: Control<any>;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "phone-pad" | "email-address";
  placeholder?: string;
  prefix?: React.ReactNode;
}

export default function FormInput({
  name,
  label,
  control,
  secureTextEntry,
  keyboardType = "default",
  placeholder,
  prefix,
}: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <View style={[styles.inputRow, error && { borderBottomColor: "red" }]}>
            {prefix && <View style={styles.prefix}>{prefix}</View>}
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              placeholder={placeholder}
              placeholderTextColor="#BDBDBD"
            />
          </View>
          {error && <Text style={styles.error}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "700",
    fontSize: 14,
    color: PURPLE,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#C8860A",
  },
  prefix: {
    marginRight: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    paddingVertical: 6,
  },
  error: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
});