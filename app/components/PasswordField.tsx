import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  onChangeText: (text: string) => void; // Add onChangeText prop
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  placeholder,
  onChangeText, // Destructure onChangeText prop
}) => {
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleChange = (text: string) => {
    setPassword(text);
    // Basic validation: at least 8 characters, including a number
    const isValid = text.length >= 8 && /\d/.test(text);
    setIsValid(isValid);
    onChangeText(text); // Call the onChangeText function from props
  };

  return (
    <View className="mb-5">
      <Text className="text-lg mb-1">{label}</Text>
      <View
        className={`flex-row items-center border rounded-lg p-2 ${
          isValid ? "border-green-500" : "border-gray-300"
        }`}
      >
        <Ionicons name="lock-closed" size={20} color="gray" className="mr-2" />
        <TextInput
          secureTextEntry
          className="flex-1 h-10"
          value={password}
          placeholder={placeholder}
          onChangeText={handleChange}
        />
        {isValid && (
          <Ionicons name="checkmark-circle" size={20} color="green" />
        )}
      </View>
      {!isValid && password.length > 0 && (
        <Text className="text-red-500 text-sm mt-1">
          Password must be at least 8 characters and include a number.
        </Text>
      )}
    </View>
  );
};

export default PasswordField;
