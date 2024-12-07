import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
  FlatList,
  Animated,
} from "react-native";

const CATEGORIES = [
  {
    text: "All Categories",
    image: require("../../assets/images/gif/Imagecat.png"),
    backgroundColor: "bg-orange-500",
  },
  {
    text: "All Sellers",
    image: require("../../assets/images/gif/Imagebuis.png"),
    backgroundColor: "bg-blue-500",
  },
  {
    text: "Lost Items",
    image: require("../../assets/images/gif/Imagecat.png"),
    backgroundColor: "bg-green-500",
  },
  // {
  //   text: "Category 3",
  //   image: require("../../assets/images/gif/Imagecat.png"),
  //   backgroundColor: "bg-green-500",
  // },
  // {
  //   text: "Category 4",
  //   image: require("../../assets/images/gif/Imagecat.png"),
  //   backgroundColor: "bg-green-500",
  // },
];

const dummyLostItems = [
  {
    id: 1,
    title: "Lost Wallet",
    description: "Black leather wallet found near the park.",
    image:
      "https://images.pexels.com/photos/915915/pexels-photo-915915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Placeholder image
  },
  {
    id: 2,
    title: "Missing Bicycle",
    description: "Red mountain bike missing from the bike rack.",
    image:
      "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 3,
    title: "Lost Keys",
    description: "Set of keys found at the library entrance.",
    image:
      "https://images.pexels.com/photos/14721/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const dummySellers = [
  {
    id: 1,
    name: "John Doe",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    verified: true,
    likes: 150,
  },
  {
    id: 2,
    name: "Jane Smith",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    verified: false,
    likes: 95,
  },
  {
    id: 3,
    name: "Mike Johnson",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    verified: true,
    likes: 200,
  },
];

interface LostItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface Seller {
  id: number;
  name: string;
  image: string;
  verified: boolean;
  likes: number;
}
const Category: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]); // State for admin
  const [lostItems, setLostItems] = useState<any[]>(dummyLostItems); // Use dummy data for lost items

  const fetchAdminUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8888/.netlify/functions/api/v1/user/admin-users"
      );
      if (response.data.success) {
        setAdminUsers(response.data.users); // Assuming users are returned in response
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to fetch admin users."
        );
      }
    } catch (error) {
      console.error("Error fetching admin users:", error);
      Alert.alert("Error", "Could not fetch admin users.");
    }
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://preeminent-macaron-3cd7d6.netlify.app/.netlify/functions/api/v1/cat/get-all"
        );

        if (response.data.success) {
          setCategories(response.data.categories);
          console.log(response.data.categories._id);
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

  const flatListRef = useRef<FlatList>(null); // Reference to FlatList
  const scrollX = useRef(new Animated.Value(0)).current; // Animated value for sliding

  const handlePress = (category: string) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? null : category
    );

    if (category === "Lost Items") {
      // Scroll to the first item if Lost Items is selected
      flatListRef.current?.scrollToIndex({ index: 0, animated: true });
    }
  };
  const handleSellers = (item: Seller) => {
    console.log(item);
    router.push(`/sellersList/${item.id}`);
  };

  const renderSellers = () => (
    <View>
      <Text className="text-gray text-lg font-bold ml-6">Top 3 Sellers </Text>
      <FlatList
        data={dummySellers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: Seller }) => (
          <TouchableOpacity onPress={() => handleSellers(item)}>
            <View className="p-4 border-b border-white border-2 flex-row items-center">
              <Image
                source={{ uri: item.image }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
              <View className="ml-3 flex-1">
                <Text className="text-lg font-bold">
                  {item.name}
                  <Ionicons name="checkmark-circle" size={15} color="green" />
                </Text>
                <Text className="text-gray-600">
                  {item.verified ? "Verified Seller" : "Not Verified"} |
                  {item.likes}
                  Likes
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => Alert.alert("Message Icon Pressed")}
              >
                <Ionicons name="chatbubble-outline" size={24} color="blue" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
      {/* become a seller and view more sellers*/}
      <View className="flex-row justify-between p-4 px-6">
        <TouchableOpacity>
          <Text className="text-blue-500">Become a Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-blue-500">View More Sellers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  const handleLostItems = (item: LostItem) => {
    console.log("Reporting item:", item);
    router.push(`/lostItem/${item.id}`);
  };

  const renderLostItem = ({ item }: { item: LostItem }) => (
    <TouchableOpacity
      className="mr-2 mt-3"
      onPress={() => handleLostItems(item)}
    >
      <View className="p-4 border-b border-white">
        <Image
          source={{ uri: item.image }} // Use dummy image URLs
          style={{ width: "100%", height: 200, borderRadius: 8 }}
          resizeMode="cover"
        />
        <Text className="text-lg font-bold mt-2">{item.title}</Text>
        <Text className="text-gray-600 mt-1">{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (selectedCategory) {
      case "All Categories":
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {categories.map((item, index) => (
                <TouchableOpacity key={index} className="mr-2 mt-3">
                  <ImageBackground
                    source={{ uri: item.images[0].url }}
                    className="h-20 w-20 rounded-lg items-center justify-end" // Use rounded-lg for Tailwind-style rounding
                  >
                    <View className="h-8 rounded-lg flex justify-center items-center  bg-gray-100 px-1 mb-1 ">
                      <Text className="text-gray-500 self-center text-xs ">
                        {item.category}
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );
      case "All Sellers":
        return renderSellers();
      case "Lost Items":
        return (
          <View>
            <FlatList
              ref={flatListRef} // Attach the reference
              data={lostItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderLostItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center" // Ensure snapping to the center
              snapToInterval={250} // Adjust based on item width
              decelerationRate="fast" // Smooth scrolling effect
            />
            {/* Report Missing item button */}
            <View className="flex-row justify-center mt-2">
              <TouchableOpacity className="self-center p-2">
                <Text className="text-red-400">Report Missing item</Text>
              </TouchableOpacity>
              <TouchableOpacity className="self-center p-2 flex-row items-center">
                <Text className="text-gray-400"> View More items... </Text>
                <Ionicons name="arrow-forward" size={16} color="gray" />
                {/* Arrow icon */}
              </TouchableOpacity>
            </View>
          </View>
        );
      case "Category 3":
        return <Text>Displaying items for Category 3...</Text>;
      case "Category 4":
        return <Text>Displaying items for Category 4...</Text>;
      default:
        return null;
    }
  };

  return (
    <View className="pl-1">
      <Text className="text-lg font-bold mb-2">Business Section</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {CATEGORIES.map((category, index) => {
          const bgColor =
            selectedCategory === category.text
              ? "bg-trasparent"
              : category.backgroundColor;

          const bgcolor =
            selectedCategory === category.text
              ? "border border-gray-300"
              : bgColor;
          const textcolor =
            selectedCategory === category.text ? "text-gray-500" : "text-white";
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(category.text)}
              className={`w-38 h-14 ${bgColor} ${bgcolor} justify-center items-center rounded ${
                index < CATEGORIES.length - 1 ? "mr-2" : ""
              }`}
            >
              <View className="flex-1 flex-row items-center pl-3 gap-2">
                <Text className={`${textcolor} text-lg font-bold`}>
                  {category.text}
                </Text>
                <Image
                  source={category.image}
                  style={{ width: 30, height: 30, marginRight: 5 }}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View>{renderContent()}</View>
    </View>
  );
};

export default Category;
