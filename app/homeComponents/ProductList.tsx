import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useContext, memo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ProductContext } from "@/context/ProductContext";
import { router } from "expo-router";

// Define a type for the Product
interface Product {
  createdAt: string;
  id: any;
  name: string;
  description: string;
  images: { url: string }[];
}

// Create a memoized ProductItem component
const ProductItem: React.FC<{
  item: Product;
  handleDetails: (item: Product) => void;
}> = memo(({ item, handleDetails }, index) => (
  <TouchableOpacity onPress={() => handleDetails(item)} key={index}>
    <View className="w-44 h-56 bg-gray-200 rounded-lg p-2 m-2 relative">
      <Image
        source={{ uri: item.images[0].url }}
        className="w-full h-28 rounded-lg object-cover"
      />
      <Text className="text-sm font-bold mt-2">{item.name}</Text>
      <Text
        className="text-xm text-gray-600 mt-1"
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
));

// Main ProductList component
const ProductList: React.FC = () => {
  const context = useContext(ProductContext);

  // Ensure context is defined
  if (!context) {
    throw new Error("ProductList must be used within a ProductProvider");
  }

  const { state } = context; // Destructure state from context
  const { products, loading, error } = state;

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error}</Text>;

  const handleDetails = (item: Product) => {
    // Navigate to the product details page
    router.push(`/Product/${item.name + item.createdAt}`);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <ProductItem
      item={item}
      handleDetails={handleDetails}
      key={item.name.length}
    />
  );

  return (
    <View className="pl-3 bg-white">
      <View className="flex-row justify-between px-4">
        <Text className="text-xl font-bold mb-2">All Products</Text>
        <MaterialIcons name="arrow-right" size={24} />
      </View>
      <FlatList<Product>
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.name + item.createdAt}`} // Ensure unique key
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ProductList;
