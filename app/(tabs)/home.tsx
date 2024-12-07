import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import Header from "../homeComponents/Hearder"; // Adjust the path as needed
import Banner from "../components/Carousel";
import Category from "../homeComponents/listSections";
import TopRankings from "../homeComponents/TopRankings";
import NewArrivals from "../homeComponents/NewArivals";
import ProductList from "../homeComponents/ProductList";
import { router } from "expo-router";
import Chat from "../homeComponents/Chat";

interface Product {
  createdAt: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
}

const Home: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [showfull, setShowFull] = useState(true);

  const data = [
    { key: "banner", component: <Banner /> },
    { key: "category", component: <Category /> },
    { key: "topRankings", component: <TopRankings /> },
    { key: "newArrivals", component: <NewArrivals /> },
    { key: "productList", component: <ProductList /> },
    { key: "chat", component: <Chat /> },
  ];
  const handleDetails = (item: Product) => {
    // Navigate to the product details page
    router.push(`/Product/${item.name + item.createdAt}`);
    setShowSearch(!showSearch);
  };
  const handleSearchResults = (searchResults: Product[]) => {
    setResults(searchResults);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="mt-4">
      <Header
        setShowSearch={setShowSearch}
        onSearchResults={handleSearchResults}
      />
      {showSearch ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                handleDetails(item);
                setShowFull(showfull);
              }}
              className="pt-2"
            >
              <View className="p-4 bg-gray-200 rounded-[20px] flex-row px-2 ">
                <View className="">
                  <Image
                    source={{ uri: item.images[0].url }}
                    className="w-20 h-20 rounded-[10px] "
                    resizeMode="cover"
                  />
                </View>

                <View className="px-2 flex-1">
                  <Text>{item.name}</Text>
                  <Text numberOfLines={2} className="text-gray-500">
                    {item.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => <>{item.component}</>}
          keyExtractor={(item) => item.key}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
