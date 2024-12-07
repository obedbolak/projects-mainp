import {
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  PanResponder,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { ProductContext } from "@/context/ProductContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppDispatch } from "../../redux/hooks";
import { addItem, updateQuantity } from "../../redux/cartslice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ProductDetails: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const context = useContext(ProductContext);
  const dispatch = useAppDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Ensure context is defined
  if (!context) {
    throw new Error("ProductDetails must be used within a ProductProvider");
  }

  const { state } = context;
  const { products, loading, error } = state;

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error}</Text>;

  // Find the product by ID
  const product = products.find(
    (item) => `${item.name + item.createdAt}` === id
  );

  // Check if the product is found
  if (!product) {
    return <Text>Product not found</Text>;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeToggle, setActiveToggle] = useState<
    "Description" | "Reviews" | "AdditionalDetails"
  >("Description");

  // Check if the product is in the cart
  useEffect(() => {
    const existingItem = cartItems.find(
      (item) => item.id === product.name + product.createdAt
    );
    if (existingItem) {
      setQuantity(existingItem.quantity);
    }
  }, [cartItems, product]);

  const handleSwipe = (direction: string) => {
    if (direction === "left" && currentIndex < product.images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "right" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 30; // Threshold for swipe
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -30) {
        handleSwipe("left");
      } else if (gestureState.dx > 30) {
        handleSwipe("right");
      }
    },
  });

  const renderContent = () => {
    switch (activeToggle) {
      case "Description":
        return <Text>{product.description}</Text>;
      case "Reviews":
        return (
          <View className="p-4 bg-white ">
            {product.reviews.map((rev, index) => (
              <View key={index} className="mb-4 p-2 border-b">
                <Text className="font-semibold">{rev.name}</Text>
                <Text className="text-gray-600">{rev.comment}</Text>
              </View>
            ))}
          </View>
        );
      case "AdditionalDetails":
        return <Text>Additional product details go here...</Text>;
      default:
        return null;
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 1;
      const productId = product.name + product.createdAt;
      dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
      return newQuantity; // Update state with the new quantity
    });
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => {
      const newQuantity = Math.max(prev - 1, 1);
      const productId = product.name + product.createdAt;
      dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
      return newQuantity; // Update state with the new quantity
    });
  };

  const handleAddToCart = () => {
    const productId = product.name + product.createdAt;
    dispatch(addItem({ ...product, id: productId, quantity }));
  };

  return (
    <View style={{ flex: 1, padding: 1, position: "relative", paddingTop: 15 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{ width: "108%", alignSelf: "center", marginTop: 10 }}
          {...panResponder.panHandlers}
        >
          <ImageBackground
            source={{ uri: product.images[currentIndex].url }}
            style={{ width: "100%", height: 370 }}
            imageStyle={{ borderRadius: 10 }}
            resizeMode="cover"
          >
            <TouchableOpacity
              className="absolute top-2 pl-7 bg-transparent"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={23} color={"red"} />
            </TouchableOpacity>
            <View className="absolute inset-0 flex-row items-center justify-between p-4 gap-1 bottom-0 r-0">
              <TouchableOpacity
                className={`${
                  currentIndex === 0 ? "bg-transparent" : "bg-blue-500"
                } px-4 py-2 rounded`}
                onPress={() => handleSwipe("right")}
                disabled={currentIndex === 0}
              >
                <Text className="text-white">
                  <Ionicons
                    name="arrow-back"
                    size={20}
                    color={currentIndex === 0 ? "gray" : "blue"}
                  />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`${
                  currentIndex === product.images.length - 1
                    ? "bg-transparent"
                    : "bg-blue-500"
                } px-4 py-2 rounded`}
                onPress={() => handleSwipe("left")}
                disabled={currentIndex === product.images.length - 1}
              >
                <Text className="text-white">
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={currentIndex === 0 ? "gray" : "blue"}
                  />
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        <View className="flex-row items-center justify-between px-4 gap-3 mt-1">
          <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 18 }}>
            {product.name}
            <Ionicons name="checkmark-circle" size={20} color="green" />
          </Text>
          <TouchableOpacity className="top-2">
            <Ionicons name="heart-outline" size={24} color="black" />
            <Text className="text-gray-400">295</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between top-4 px-5">
          <View className="flex-row self-center gap-4 items-center">
            <View className="flex-row items-center justify-center">
              <Text className="text-l">Rating:</Text>
              <Text style={{ fontSize: 19, fontWeight: "bold", color: "gray" }}>
                {product.rating}.0
                <Ionicons name="star" color={"gold"} size={20} />
              </Text>
            </View>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 26 }}>
              <Text className="text-2xl text-orange-500">
                ${product.price * quantity}
              </Text>
              <Text className="text-sm text-gray-500 line-through">
                ${product.price * 2}
              </Text>
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Text>Stock:</Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginTop: 16,
                color: "green",
              }}
            >
              {product.stock}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center mt-4">
          <Text className="text-lg font-bold pl-4">Quantity: </Text>
          <TouchableOpacity
            onPress={decreaseQuantity}
            className="bg-gray-300 p-2 rounded-l flex items-center justify-center"
          >
            <Ionicons name="remove" size={14} color="#000" />
          </TouchableOpacity>
          <View className="bg-gray-200 p-2">
            <Text className="text-lg">{quantity}</Text>
          </View>
          <TouchableOpacity
            onPress={increaseQuantity}
            className="bg-gray-300 p-2 rounded-r flex items-center justify-center"
          >
            <Ionicons name="add" size={15} color="#000" />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row justify-between p-4 pt-7">
          <TouchableOpacity
            className={`p-2 rounded ${
              activeToggle === "Description" ? "bg-blue-500" : "bg-gray-200"
            }`}
            onPress={() => setActiveToggle("Description")}
          >
            <Text
              className={
                activeToggle === "Description"
                  ? "text-center text-white"
                  : "text-center text-black"
              }
            >
              Description
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-2 rounded ${
              activeToggle === "Reviews" ? "bg-blue-500" : "bg-gray-200"
            }`}
            onPress={() => setActiveToggle("Reviews")}
          >
            <Text
              className={
                activeToggle === "Reviews"
                  ? "text-center text-white"
                  : "text-center text-black"
              }
            >
              Reviews
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-2 rounded ${
              activeToggle === "AdditionalDetails"
                ? "bg-blue-500"
                : "bg-gray-200"
            }`}
            onPress={() => setActiveToggle("AdditionalDetails")}
          >
            <Text
              className={
                activeToggle === "AdditionalDetails"
                  ? "text-center text-white"
                  : "text-center text-black"
              }
            >
              Additional Details
            </Text>
          </TouchableOpacity>
        </View>
        <View className="p-4 pb-20">{renderContent()}</View>
      </ScrollView>
      <View className="absolute bottom-0 p-4 bg-transparent flex-row gap-4 self-center">
        <TouchableOpacity
          className="mb-2 rounded bg-blue-500 p-3"
          onPress={handleAddToCart}
        >
          <Text className="text-center text-white">Add To Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mb-2 rounded bg-orange-500 p-3">
          <Text className="text-center text-white">Buy Now</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mb-2 rounded bg-green-500 px-2">
          <Text className="text-center text-white">{cartItems.length}</Text>
          <Ionicons name="cart-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetails;
