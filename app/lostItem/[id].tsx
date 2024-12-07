import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

interface LostItem {
  id: number;
  title: string;
  description: string;
  images: string[];
  contactNumber: string;
}

const dummyLostItems: LostItem[] = [
  {
    id: 1,
    title: "Lost Wallet",
    description: "Black leather wallet found near the park.",
    images: [
      "https://images.pexels.com/photos/915915/pexels-photo-915915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    contactNumber: "123-456-7890",
  },
  {
    id: 2,
    title: "Missing Bicycle",
    description: "Red mountain bike missing from the bike rack.",
    images: [
      "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    contactNumber: "123-456-7890",
  },
  {
    id: 3,
    title: "Lost Keys",
    description: "Set of keys found at the library entrance.",
    images: [
      "https://images.pexels.com/photos/14721/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    contactNumber: "123-456-7890",
  },
];

const LostItems: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedItem, setSelectedItem] = useState<LostItem | undefined>(
    dummyLostItems.find((item) => item.id === Number(id))
  );

  const handleItemSelect = (item: LostItem) => {
    setSelectedItem(item);
  };

  if (!selectedItem) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Item not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 mt-20">
      <Text className="text-2xl font-bold">{selectedItem.title}</Text>
      <Text className="mt-2 text-lg">{selectedItem.description}</Text>

      <Image
        source={{ uri: selectedItem.images[0] }}
        style={{ width: Dimensions.get("window").width, height: 300 }}
        resizeMode="cover"
        className="mt-4 rounded-lg"
      />

      <View className="mt-4">
        <Text className="font-semibold">Contact:</Text>
        <Text>{selectedItem.contactNumber}</Text>
      </View>

      <TextInput
        placeholder="Send a message..."
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          padding: 10,
          width: "100%",
          marginTop: 10,
        }}
      />
      <Button title="Send Message" onPress={() => alert("Message sent!")} />

      <Text className="mt-6 text-lg font-semibold">Related Items:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4"
      >
        {dummyLostItems
          .filter((item) => item.id !== selectedItem.id)
          .map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleItemSelect(item)}
              className="mr-4"
            >
              <View className="w-40">
                <Image
                  source={{ uri: item.images[0] }}
                  style={{ width: "100%", height: 100 }}
                  resizeMode="cover"
                  className="rounded-lg"
                />
                <Text className="text-sm font-semibold mt-2">{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

export default LostItems;
