import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useAuth } from "@/context/AuthContext";
import EmailField from "../components/EmailField";
import FullNameField from "../components/NameField"; // Make sure this is the correct path
import { SafeAreaView } from "react-native-safe-area-context";
import PasswordField from "../components/PasswordField";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";

const SignUp = () => {
  const { signUp } = useAuth(); // Correctly destructured signUp
  const [email, setEmail] = useState("");
  const [name, setFullName] = useState("");
  const [password, setPassword] = useState("");

  let city = "loss agel";
  let address = "aksdhfo";
  let phone = "12726372378";
  let answer = "yes";
  let country = "USA";

  const handleSignUp = () => {
    // Call signUp with fullName, email, and password
    signUp(name, email, password, city, address, phone, answer, country); // Adjust this if you want to include fullName in the context
  };

  const handleGoogleSignIn = () => {
    // Implement Google sign-in logic
  };

  const handleFacebookSignIn = () => {
    // Implement Facebook sign-in logic
  };

  return (
    <SafeAreaView className="flex-1 p-4 justify-center">
      <Image
        source={require("../../assets/images/gif/Animregister.gif")}
        className="w-150 h-150"
      />
      <Text className="text-2xl mb-4 text-center">Sign Up Screen</Text>
      {/* Full name field */}
      <FullNameField
        label="Full Name"
        placeholder="Enter your full name"
        onChangeText={setFullName}
      />
      {/* Password field */}
      <PasswordField
        label="Password"
        placeholder="Enter your password"
        onChangeText={setPassword}
      />
      {/* Email field */}
      <EmailField
        label="Email"
        helperText="Enter your email address"
        placeholder="example@example.com"
        clearButtonVisible={true}
        onChangeText={setEmail}
      />
      {/* Sign Up button */}
      <CustomButton theme="primary" onPress={handleSignUp}>
        <Text className="text-white">Sign Up</Text>
      </CustomButton>
      <View className="flex-row justify-center my-2">
        <Text>I have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/auth/SignIn")}>
          <Text className="text-blue-500">Sign In</Text>
        </TouchableOpacity>
      </View>
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

      <Text className="text-center text-sm text-gray-500">
        By signing in, you agree to our
        <TouchableOpacity>
          <Text className="text-blue-500">Terms and Conditions</Text>
        </TouchableOpacity>
      </Text>
    </SafeAreaView>
  );
};

export default SignUp;
