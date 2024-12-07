import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import EmailField from "../components/EmailField";
import { SafeAreaView } from "react-native-safe-area-context";
import PasswordField from "../components/PasswordField";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";

const ForgotPassword = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const resetPassword = async () => {
    const url =
      "https://preeminent-macaron-3cd7d6.netlify.app/.netlify/functions/api/v1/user/password/reset";
    const data = {
      email: email,
      newPassword: newPassword,
      answer: "Pancakes",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Password reset successful!");
        setNewPassword("");
        setEmail("");
        router.push("/auth/SignIn");
      } else {
        Alert.alert("Error", result.message || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Error");
    }
  };
  return (
    <SafeAreaView className="flex-1 p-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className=" justify-center">
            <Image
              source={require("../../assets/images/gif/login.gif")}
              className="w-150 h-150"
            />
            <Text className="text-2xl mb-4 text-center">Forgot Password</Text>
            <EmailField
              label="Email"
              helperText="Enter your email address"
              placeholder="example@example.com"
              clearButtonVisible={true}
              onChangeText={setEmail}
            />
            <PasswordField
              label="New Password"
              placeholder="Enter your password"
              onChangeText={setNewPassword}
            />
            <CustomButton theme="primary" onPress={resetPassword}>
              <Text className="text-white">Set New Password</Text>
            </CustomButton>

            <View className="flex-row justify-center my-2">
              <Text>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/SignUp")}>
                <Text className="text-blue-500">Sign Up</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-center text-sm text-gray-500">
              By signing in, you agree to our
              <TouchableOpacity>
                <Text className="text-blue-500">Terms and Conditions</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
