import { View, Text, Image, FlatList, ListRenderItemInfo } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface Seller {
  id: number;
  name: string;
  image: string;
  likes: number;
  duration: string;
  positiveFeedback: number;
  negativeFeedback: number;
  verified: boolean;
  description: string;
  country: string;
  businessName: string;
}

interface Product {
  title: string;
  description: string;
  rating: number;
  reviews: number;
  image: string;
}

const Sellers: React.FC = () => {
  const { id } = useLocalSearchParams();

  const dummySellers: Seller[] = [
    {
      id: 1,
      name: "John Doe",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      verified: true,
      likes: 150,
      duration: "1 year",
      positiveFeedback: 90,
      negativeFeedback: 10,
      description: "A dedicated seller with a passion for quality products.",
      country: "USA",
      businessName: "Doe's Electronics",
    },
    {
      id: 2,
      name: "Jane Smith",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      verified: false,
      likes: 95,
      duration: "6 months",
      positiveFeedback: 80,
      negativeFeedback: 20,
      description: "Creative and innovative, always bringing new ideas.",
      country: "Canada",
      businessName: "Smith's Craft Shop",
    },
    {
      id: 3,
      name: "Mike Johnson",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      verified: true,
      likes: 200,
      duration: "2 years",
      positiveFeedback: 95,
      negativeFeedback: 5,
      description: "A reliable seller with a focus on customer satisfaction.",
      country: "UK",
      businessName: "Johnson's Gadgets",
    },
  ];

  const seller = dummySellers.find((s) => s.id === Number(id));

  if (!seller) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Seller not found</Text>
      </View>
    );
  }

  const products: Product[] = [
    {
      title: "Wireless Headphones",
      description: "High-quality sound with noise cancellation.",
      rating: 4.5,
      reviews: 10,
      image:
        "https://s.alicdn.com/@sc04/kf/Hc3b46d0ce9da42ddb9f4770e7748b12aK.jpg_720x720q50.jpg",
    },
    {
      title: "Smartphone Stand",
      description: "Adjustable stand for your smartphone.",
      rating: 4.0,
      reviews: 8,
      image:
        "https://s.alicdn.com/@sc04/kf/Hd9d73827d6ce4bd7a0f195c80fa802e03.jpg_720x720q50.jpg",
    },
  ];

  const renderItem = ({ item }: ListRenderItemInfo<Product>) => (
    <View className="flex-1 gap-3 px-4">
      <Image source={{ uri: item.image }} className="w-3/5 h-20" />
      <View>
        <Text className="font-bold">{item.title}</Text>
        <Text numberOfLines={2} className="w-40">
          {item.description}
        </Text>
        <Text>Rating: {item.rating}</Text>
        <Text>Reviews: {item.reviews}</Text>
      </View>
    </View>
  );
  return (
    <View className="flex-1 p-4 mt-20">
      {/* Seller Section */}
      <View className="mb-4 border-b border-gray-300 pb-4">
        <View className="flex-row  px-3">
          {/* Seller Image and Details */}
          <View className="mr-4">
            <Image
              source={{ uri: seller.image }}
              style={{ width: 100, height: 100 }}
            />
          </View>

          <View className="flex-1">
            <Text className="text-xl font-bold">{seller.name}</Text>
            <Text className="text-green-400 font-bold">
              {seller.businessName}
            </Text>
            <Text>{seller.description}</Text>
            <Text className="mt-1">
              {seller.country} <Text>🇺🇸</Text>
              {/* Replace with dynamic flag if needed */}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between px-3 mt-3">
          <View>
            <Text>Likes: {seller.likes}</Text>
            <Text>Duration: {seller.duration}</Text>
          </View>
          <View>
            <Text>Positive Feedback: {seller.positiveFeedback}%</Text>
            <Text>Negative Feedback: {seller.negativeFeedback}%</Text>
            <View className="flex-row items-center">
              <Text>{seller.verified ? "Verified" : "Not Verified"}</Text>
              {seller.verified ? (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="green"
                  style={{ marginLeft: 5 }}
                />
              ) : (
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="red"
                  style={{ marginLeft: 5 }}
                />
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Products Section */}
      <View>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()} // Use a unique key
          horizontal // This makes the list horizontal
          showsHorizontalScrollIndicator={false} // Optional: Hide the scroll indicator
        />
      </View>
    </View>
  );
};

export default Sellers;
