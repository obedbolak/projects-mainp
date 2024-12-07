import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="Settings" options={{ headerShown: false }} />
      <Stack.Screen
        name="ManageProducts"
        options={{
          headerTitle: "Product Management",
          headerStyle: {
            backgroundColor: "transparent", // Make the header background transparent
          },
          headerTransparent: true,
          headerTitleStyle: {
            color: "#000", // Set title color to contrast against your background
          },
          headerTintColor: "#000", // Set the back button color
        }}
      />
    </Stack>
  );
};

export default _layout;
