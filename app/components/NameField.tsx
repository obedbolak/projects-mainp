import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FullNameFieldProps {
  label: string;
  placeholder: string;
  onChangeText: (text: string) => void; // Add onChangeText prop
}

const FullNameField: React.FC<FullNameFieldProps> = ({
  label,
  placeholder,
  onChangeText, // Destructure onChangeText prop
}) => {
  const [fullName, setFullName] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleChange = (text: string) => {
    setFullName(text);
    // Validate: Check if the name has at least two words
    const words = text.trim().split(" ");
    const valid = words.length >= 2;
    setIsValid(valid);
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
        <Ionicons name="person" size={20} color="gray" className="mr-2" />
        <TextInput
          className="flex-1 h-10"
          value={fullName}
          placeholder={placeholder}
          onChangeText={handleChange}
        />
        {isValid && (
          <Ionicons name="checkmark-circle" size={20} color="green" />
        )}
      </View>
      {!isValid && fullName.length > 0 && (
        <Text className="text-red-500 text-sm mt-1">
          Please enter your full name (first and last).
        </Text>
      )}
    </View>
  );
};

export default FullNameField;
