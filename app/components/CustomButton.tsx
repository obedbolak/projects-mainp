import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface CustomButtonProps {
  theme: "primary" | "secondary" | "tertiary" | "error";
  children: React.ReactNode;
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  theme,
  children,
  onPress,
}) => {
  const buttonStyles = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-300 text-black",
    tertiary: "bg-white border border-blue-500 text-blue-500",
    error: "bg-red-500 text-white",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`py-2 px-4 rounded items-center ${buttonStyles[theme]}`}
    >
      <Text className="text-lg font-semibold">{children}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
