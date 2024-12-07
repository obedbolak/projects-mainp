import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Dashboard = () => {
  return (
    <SafeAreaView>
      <View className="flex-row h-full">
        {/* Sidebar */}
        <View className="w-48 bg-gray-800 p-4">
          <Text className="text-white text-lg font-bold mb-4">Dashboard</Text>
          <Text className="text-gray-300 mb-4">Home</Text>
          <Text className="text-gray-300 mb-4">Products</Text>
          <Text className="text-gray-300 mb-4">Orders</Text>
          <Text className="text-gray-300 mb-4">messages</Text>
          <Text className="text-gray-300 mb-4">Settings</Text>
        </View>

        {/* Main Content */}
        <View className="flex-1 p-6 bg-gray-100">
          <Text className="text-2xl font-bold mb-2">
            Welcome to Your Dashboard
          </Text>
          <Text className="text-gray-700 mb-6">
            Select an option from the sidebar.
          </Text>

          <ScrollView>
            {/* Card 1 */}
            <TouchableOpacity
              className="bg-blue-500 rounded-lg p-4 mb-4 shadow-md"
              onPress={() => router.push("/(Settings)/ManageProducts")}
            >
              <Text className="text-white text-lg font-semibold">
                Manage Products
              </Text>
              <Text className="text-white text-sm">
                Add, edit, or delete products.
              </Text>
            </TouchableOpacity>

            {/* Card 2 */}
            <TouchableOpacity className="bg-blue-500 rounded-lg p-4 mb-4 shadow-md">
              <Text className="text-white text-lg font-semibold">
                View Orders
              </Text>
              <Text className="text-white text-sm">See all your orders.</Text>
            </TouchableOpacity>

            {/* Card 3 */}
            <TouchableOpacity className="bg-blue-500 rounded-lg p-4 mb-4 shadow-md">
              <Text className="text-white text-lg font-semibold">
                Customer Support
              </Text>
              <Text className="text-white text-sm">Get help and support.</Text>
            </TouchableOpacity>

            {/* Add more cards as needed */}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
