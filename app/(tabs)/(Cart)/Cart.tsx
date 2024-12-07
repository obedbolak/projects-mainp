import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store"; // Adjust the import path as necessary
import { Ionicons } from "@expo/vector-icons";
import { removeItem } from "@/redux/cartslice";
import { useAppDispatch } from "@/redux/hooks";
import { router } from "expo-router";

const Cart = () => {
  const dispatch = useAppDispatch();
  // Select cart items from Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id)); // Correct way to dispatch the removeItem action
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4 self-center">Shopping Cart</Text>
      {cartItems.length === 0 ? (
        <Text className="text-lg">Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()} // Ensure the key is a string
          renderItem={({ item }) => (
            <View className="p-4 border-b border-gray-300 flex-row items-center justify-between">
              <View className="flex-row flex-1 items-center mr-4">
                <Image
                  source={{ uri: item.images[0].url }}
                  className="w-20 h-20 mb-2"
                />
                <View className="pl-4">
                  <Text className="text-lg font-semibold">{item.name}</Text>
                  <Text>Price: ${item.price}</Text>
                  <Text>Quantity: {item.quantity}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleRemoveItem(item.id)}
                className="ml-3"
              >
                <Image
                  source={require("../../../assets/images/gif/trash.png")}
                  className="h-10 w-10"
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <View className="flex-row justify-between items-center p-4 border-t border-gray-300">
        <Text className="text-lg font-semibold">Total:</Text>
        <Text className="text-lg font-semibold">
          $
          {cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          )}
        </Text>
        {/* Add checkout button or other actions */}
        <TouchableOpacity className="flex-row items-center gap-1">
          <Text
            className="text-blue-500"
            onPress={() => router.push("/(Cart)/Check")}
          >
            Checkout
          </Text>
          <Ionicons name="arrow-forward" size={18} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;
