import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmailFieldProps {
  label: string;
  onChangeText: (text: string) => void; // Change type to a function
  helperText?: string;
  placeholder: string;
  clearButtonVisible?: boolean;
  onClear?: () => void;
}

const EmailField: React.FC<EmailFieldProps> = ({
  label,
  helperText,
  placeholder,
  clearButtonVisible = false,
  onClear,
  onChangeText,
}) => {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleChange = (text: string) => {
    setEmail(text);
    setIsInvalid(!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(text)); // Basic email validation
    onChangeText(text); // Call the onChangeText function from props
  };

  const handleClear = () => {
    setEmail("");
    if (onClear) {
      onClear();
    }
    onChangeText(""); // Call the onChangeText function from props when clearing
  };

  return (
    <View className="mb-5">
      <Text className="text-lg mb-1">{label}</Text>
      <View
        className={`flex-row items-center border rounded-lg p-2 ${
          isFocused ? "border-blue-500" : "border-gray-300"
        } ${isInvalid ? "border-red-300" : ""}`}
      >
        <Ionicons name="mail" size={20} color="gray" className="mr-2" />
        <TextInput
          className="flex-1 h-10"
          value={email}
          placeholder={placeholder}
          onChangeText={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {clearButtonVisible && email ? (
          <TouchableOpacity onPress={handleClear} className="p-1">
            <Ionicons name="close-circle" size={20} color="gray" />
          </TouchableOpacity>
        ) : null}
      </View>
      {helperText && (
        <Text className="text-gray-600 text-sm mt-1">{helperText}</Text>
      )}
      {isInvalid && (
        <Text className="text-red-500 text-sm mt-1">Invalid email address</Text>
      )}
    </View>
  );
};

export default EmailField;
