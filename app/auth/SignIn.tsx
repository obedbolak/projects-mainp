import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import EmailField from "../components/EmailField";
import { SafeAreaView } from "react-native-safe-area-context";
import PasswordField from "../components/PasswordField";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";

const SignIn = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePrimaryPress = () => {
    signIn(email, password);
  };

  const handleGoogleSignIn = () => {
    // Implement Google sign-in logic
  };

  const handleFacebookSignIn = () => {
    // Implement Facebook sign-in logic
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
          <View className="flex-1 justify-center">
            <Image
              source={require("../../assets/images/gif/login.gif")}
              className="w-150 h-150"
            />
            <Text className="text-2xl mb-4 text-center">Sign In Screen</Text>
            <EmailField
              label="Email"
              helperText="Enter your email address"
              placeholder="example@example.com"
              clearButtonVisible={true}
              onChangeText={setEmail}
            />
            <PasswordField
              label="Password"
              placeholder="Enter your password"
              onChangeText={setPassword}
            />
            <CustomButton theme="primary" onPress={handlePrimaryPress}>
              <Text className="text-white">Sign In</Text>
            </CustomButton>

            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="px-2 text-lg">or</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            <View className="flex-row justify-around mb-4">
              <TouchableOpacity onPress={handleGoogleSignIn} className="p-2">
                <Image
                  source={{
                    uri: "https://img.icons8.com/?size=48&id=17949&format=png",
                  }}
                  className="w-6 h-6"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFacebookSignIn} className="p-2">
                <Image
                  source={{
                    uri: "https://img.icons8.com/?size=48&id=uLWV5A9vXIPu&format=png",
                  }}
                  className="w-6 h-6"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="my-2"
              onPress={() => router.push("/auth/ForgotPassword")}
            >
              <Text className="text-center text-blue-500">
                Forgot Password?
              </Text>
            </TouchableOpacity>

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

export default SignIn;
