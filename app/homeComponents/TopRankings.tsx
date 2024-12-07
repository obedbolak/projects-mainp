import { ProductContext } from "@/context/ProductContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

interface Product {
  createdAt: string;
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
}

const ProductItem: React.FC<{
  item: Product;
  handleDetails: (item: Product) => void;
}> = ({ item, handleDetails }) => (
  <TouchableOpacity onPress={() => handleDetails(item)} key={item.id}>
    <View className="w-36 h-56 bg-gray-200 rounded-lg p-3 mr-2">
      <Image
        source={{ uri: item.images[0].url }}
        className="w-full h-28 rounded-lg object-cover"
      />
      <Text className="text-lg font-bold mt-2">{item.name}</Text>
      <Text
        className="text-sm text-gray-600 mt-1"
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.description}
      </Text>
      <TouchableOpacity className=" absolute self-end ">
        <Ionicons
          name="heart"
          size={24}
          color="white"
          className="absolute " // Adjust 'top' and 'right' as needed
        />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const TopRankings: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected product IDs to fetch
  const selectedIds = [
    "66f173723c9ea27d17ccc981",
    "66f1761e9b7b51553d7c4a7e",
    "66f174ce9b7b51553d7c43d9",
    "66f1769b9b7b51553d7c4d26",
  ];

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const productRequests = selectedIds.map((id) =>
          axios.get(
            `https://preeminent-macaron-3cd7d6.netlify.app/.netlify/functions/api/v1/product/${id}`
          )
        );

        const responses = await Promise.all(productRequests);
        const fetchedProducts = responses.map(
          (response) => response.data.product
        ); // Adjust based on your API response structure

        setProducts(fetchedProducts);
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error}</Text>;

  const handleDetails = (item: Product) => {
    router.push(`/Product/${item.name + item.createdAt}`);
  };

  return (
    <View className="h-72 pl-2 bg-white pt-4">
      <View className="flex-row justify-between">
        <Text className="text-xl font-bold mb-2">Top Rankings</Text>
        <MaterialIcons name="arrow-right" size={24} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((item) => (
          <ProductItem
            key={item.name + item.createdAt} // This key should remain here
            item={item}
            handleDetails={handleDetails}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default TopRankings;
