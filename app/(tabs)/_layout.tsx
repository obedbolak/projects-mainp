import { Tabs } from "expo-router";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { View, Text } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name={focused ? "home" : "home"} // Adjust icon names as needed
              size={24} // Set the size of the icon
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name={focused ? "user" : "user"} // Adjust icon names as needed
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(Settings)"
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name={focused ? "cog" : "cog"} // Adjust icon names as needed
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(Cart)"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <View>
              <FontAwesome
                name={focused ? "shopping-cart" : "shopping-cart"} // Adjust icon names as needed
                size={24}
                color={color}
              />
              {cartItems.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -6,
                    backgroundColor: "red",
                    borderRadius: 10,
                    padding: 1,
                    paddingHorizontal: 5,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 14 }}>
                    {cartItems.length}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
