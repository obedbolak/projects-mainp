// app/onboarding/index.tsx
import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

const Welcome = () => {
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = () => {
    // Simulate authentication (you should replace this with actual logic)

    // Navigate to the main application
    router.push("/auth/SignIn");
  };
  const handleSignUp = () => {
    // Simulate authentication (you should replace this with actual logic)

    // Navigate to the main application
    router.push("/auth/SignUp");
  };

  return (
    <View>
      <Text>Welcome to our application!</Text>
      <Button title="Sign In" onPress={() => handleSignIn()} />
      <Button
        title="Sign Up"
        onPress={() => {
          handleSignUp();
          /* Navigate to SignUp */
        }}
      />
    </View>
  );
};

export default Welcome;
