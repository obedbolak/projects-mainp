import {
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
  FlatList,
  TextInput,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import { ProductContext } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

// Define types for the product and user profile
interface Image {
  public_id: string;
  url: string;
  _id: string;
}

interface Product {
  stock: number;
  _id: string;
  name: string;
  description: string;
  price: number;
  images: Image[];

  uid?: string; // Assuming you have a uid field
}

interface UserProfile {
  _id: string;
  // other properties
}

const MyProductList: React.FC = () => {
  const { userProfile } = useAuth() as { userProfile: UserProfile }; // Adjust the typing as needed
  const uid = userProfile?._id.trim();
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("MyProductList must be used within a ProductProvider");
  }

  const { state } = context;
  const { products, loading, error } = state;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableProduct, setEditableProduct] = useState<Product | null>(null);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error}</Text>;

  const userProducts = products.filter((item) => item?.uid === uid);

  if (userProducts.length === 0) {
    return <Text>No products found for your profile.</Text>;
  }

  const handleEdit = (product: Product) => {
    setEditableProduct({ ...product }); // Set initial values for editing
    setIsEditing(true);
  };

  const handleChange = (field: keyof Product, value: string | number) => {
    if (editableProduct) {
      setEditableProduct((prev) => ({ ...prev!, [field]: value }));
    }
  };

  const handleSave = async () => {
    if (!editableProduct) return;

    try {
      const response = await axios.put(
        `https://preeminent-macaron-3cd7d6.netlify.app/.netlify/functions/api/v1/product/${editableProduct._id}`, // Adjust the URL as needed
        editableProduct
      );

      if (response.data.success) {
        Alert.alert("Success", "Product updated successfully");
        setIsEditing(false);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const response = await axios.delete(
        `https://preeminent-macaron-3cd7d6.netlify.app/.netlify/functions/api/v1/product/${productId}`
      );

      if (response.data.success) {
        Alert.alert("Success", "Product deleted successfully");
        // Optionally refresh the product list or remove the deleted product from state
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  return (
    <View>
      <Text>My Product List</Text>
      <FlatList
        data={userProducts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ margin: 10 }}>
            {isEditing && editableProduct?._id === item._id ? (
              <View>
                <Text>Product Name:</Text>
                <TextInput
                  value={editableProduct.name}
                  onChangeText={(text) => handleChange("name", text)}
                  placeholder="Product Name"
                  className="mt-2 p-2 border border-gray-300 rounded-md shadow-xm"
                />
                <Text>Product Description:</Text>
                <TextInput
                  value={editableProduct.description}
                  onChangeText={(text) => handleChange("description", text)}
                  placeholder="Product Description"
                  multiline // Allow text to wrap
                  className="mt-2 p-2 border border-gray-300 rounded-md shadow-xm"
                />
                <Text>Product Price:</Text>
                <TextInput
                  value={editableProduct.price.toString()}
                  onChangeText={(text) =>
                    handleChange("price", parseFloat(text))
                  }
                  placeholder="Product Price"
                  keyboardType="numeric"
                  className="mt-2 p-2 border border-gray-300 rounded-md shadow-xm"
                />
                <Text>Product Stock:</Text>

                <TextInput
                  value={editableProduct.stock.toString()}
                  onChangeText={(text) =>
                    handleChange("price", parseFloat(text))
                  }
                  placeholder="Product Price"
                  keyboardType="numeric"
                  className="mt-2 p-2 border border-gray-300 rounded-md shadow-xm mb-6"
                />
                <View className="flex-row px-9 mt-4">
                  <TouchableOpacity
                    onPress={handleSave}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-7 rounded-lg shadow-md"
                  >
                    <Text className="text-white">Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsEditing(false)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-7 rounded-lg shadow-md ml-7"
                  >
                    <Text className="text-white">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="flex-row pr-4">
                <View className="flex-1">
                  <ImageBackground
                    source={{ uri: item.images[0].url }}
                    style={{ width: 100, height: 100 }}
                  />
                </View>

                <View className="flex-column flex-1 pl-5">
                  <Text>{item.name}</Text>
                  <Text numberOfLines={4}>{item.description}</Text>
                </View>

                <View className="flex-1 py-4 ">
                  <TouchableOpacity
                    onPress={() => handleEdit(item)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2  rounded-lg shadow-md ml-9 items-center"
                  >
                    <Text className="text-white">Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDelete(item._id)}
                    className="bg-red-500 hover:bg-blue-600 text-white font-semibold py-2  rounded-lg shadow-md ml-9 mt-2 items-center"
                  >
                    <Text className="text-white">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default MyProductList;
