import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  ActivityIndicator,
  Modal,
  Button,
} from "react-native";

// Define the interface for the product items
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
}
// Define props for ProductSearch
interface ProductSearchProps {
  modalVisible: boolean;
  closeModal: () => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  modalVisible,
  closeModal,
}) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (query.length < 1) {
        setResults([]); // Clear results if the query is empty
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://preeminent-macaron-3cd7d6.netlify.app/.netlify/functions/api/v1/search?query=${query}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Product[] = await response.json();
        // Log the names of the products
        // data.forEach((item) => {
        //   console.log(item.name);
        // });
        setResults(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(fetchProducts, 300); // Debounce for 300ms
    return () => clearTimeout(debounceFetch);
  }, [query]);

  return (
    <View>
      <TextInput
        className="border border-gray-300 p-2 mb-4"
        placeholder="Search for products..."
        value={query}
        onChangeText={setQuery}
      />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text className="text-red-500">{error}</Text>}

      {/* Modal for displaying results */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded p-4 w-80">
            <FlatList
              data={results}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View className="mb-4">
                  <Text className="font-bold">{item.name}</Text>
                  <Text>{item.description}</Text>
                  <Text>Price: ${item.price}</Text>
                </View>
              )}
            />
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductSearch;
