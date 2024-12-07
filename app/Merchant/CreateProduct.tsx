import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/context/AuthContext";
import { ProductContext } from "@/context/ProductContext";

interface Item {
  title: string;
  description: string;
  image: any;
}

interface Category {
  _id: string;
  category: string;
}

const NEW_ARRIVALS: Item[] = [
  {
    title: "Item for Sale",
    description: "Versatile products designed for various applications",
    image: require("../../assets/images/gif/createproduct.png"),
  },
  {
    title: "Property Rent/sale",
    description: "Property",
    image: require("../../assets/images/gif/property.png"),
  },
  {
    title: "Cars for Sale",
    description: "Customizable vehicles that combine performance",
    image: require("../../assets/images/gif/car.png"),
  },
];

const CreateProduct: React.FC = () => {
  const { userProfile } = useAuth();
  const uid = userProfile?._id.trim();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [category, setCategory] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [images, setImages] = useState<string[]>([]); // State for multiple selected images

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://preeminent-macaron-3cd7d6.netlify.app/.netlify/functions/api/v1/cat/get-all"
        );

        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          Alert.alert(
            "Error",
            response.data.message || "Failed to fetch categories."
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        Alert.alert("Error", "Could not fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  const openModal = (item: Item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setName("");
    setDescription("");
    setStock("");
    setPrice("");
    setTags("");
    setSku("");
    setCategory("");
    setImages([]); // Clear images state
  };
  const trimmedProductName = name.trim();
  const trimmedProductdescription = description.trim();

  const handleSubmit = async () => {
    if (images.length === 0) {
      Alert.alert("Error", "Please select at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", trimmedProductName);
    formData.append("description", trimmedProductdescription);
    formData.append("stock", stock);
    formData.append("price", price);
    formData.append("category", category);
    if (uid) {
      formData.append("uid", uid); // Append only if uid is defined
    } else {
      Alert.alert("Error", "User ID is not available.");
      return;
    }
    images.forEach((uri, index) => {
      formData.append("files", {
        uri,
        name: `product_image${index + 1}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    try {
      const response = await axios.post(
        "https://preeminent-macaron-3cd7d6.netlify.app/.netlify/functions/api/v1/product/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);
      Alert.alert("Success", "Product created successfully!");
      closeModal();
    } catch (error) {
      // Handle error (same as before)
    }
  };

  const pickImages = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      // Allow multiple selections without a limit
    });

    if (!result.canceled) {
      setImages((prevImages) => [
        ...prevImages,
        ...result.assets.map((asset) => asset.uri),
      ]);
    }
  };

  function removeImage(index: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <View className="h-50 p-2 bg-white w-full">
      <View className="flex-row justify-between">
        <Text className="text-lg font-bold mb-1">Choose Product Type</Text>
      </View>
      <View className="flex-row flex-wrap">
        {NEW_ARRIVALS.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="w-1/3 p-1"
            onPress={() => openModal(item)}
          >
            <View className="bg-gray-200 rounded-lg p-2">
              <Image source={item.image} className="w-full h-20 rounded-lg" />
              <Text className="text-sm font-bold mt-2">{item.title}</Text>
              <Text
                className="text-sm text-gray-600 mt-1"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View className="flex-1 justify-end bg-black bg-opacity-50">
            <ScrollView className="bg-white rounded-t-lg p-4">
              <TouchableOpacity
                onPress={closeModal}
                className="absolute top-2 right-2"
              >
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text className="text-lg font-bold mb-2">Create Product</Text>

              <TextInput
                placeholder="Product Title"
                value={name}
                onChangeText={setName}
                className="border border-gray-300 rounded p-2 mb-4"
              />
              <TextInput
                placeholder="Product Description"
                value={description}
                onChangeText={setDescription}
                className="border border-gray-300 rounded p-2 mb-4"
                multiline
              />
              <TextInput
                placeholder="Stock"
                value={stock}
                onChangeText={setStock}
                className="border border-gray-300 rounded p-2 mb-4"
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Price"
                value={price}
                onChangeText={setPrice}
                className="border border-gray-300 rounded p-2 mb-4"
                keyboardType="decimal-pad"
              />
              <TextInput
                placeholder="Tags (comma separated)"
                value={tags}
                onChangeText={setTags}
                className="border border-gray-300 rounded p-2 mb-4"
              />
              <TextInput
                placeholder="SKU"
                value={sku}
                onChangeText={setSku}
                className="border border-gray-300 rounded p-2 mb-4"
              />

              <Text className="mb-2">Select Category:</Text>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                className="mb-4"
              >
                <Picker.Item label="Select a category" value="" />
                {categories.map((cat: Category) => (
                  <Picker.Item
                    key={cat._id}
                    label={cat.category}
                    value={cat._id}
                  />
                ))}
              </Picker>

              <TouchableOpacity
                onPress={pickImages}
                className="bg-blue-500 rounded p-2 mb-4"
              >
                <Text className="text-white text-center">Select Images</Text>
              </TouchableOpacity>

              {images.map((uri, index) => (
                <View key={index} className="relative mb-4">
                  <Image
                    source={{ uri: uri }}
                    className="w-full h-40 rounded"
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(index)} // Remove image on press
                    className="absolute top-2 right-2 bg-red-500 p-1 rounded"
                  >
                    <MaterialIcons name="delete" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ))}

              <Button title="Submit" onPress={handleSubmit} />
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default CreateProduct;
