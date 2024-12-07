import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

interface Product {
  createdAt: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
}

interface HeaderProps {
  setShowSearch: (value: boolean) => void;
  onSearchResults: (results: Product[]) => void;
}

const Header: React.FC<HeaderProps> = ({ setShowSearch, onSearchResults }) => {
  const { width } = Dimensions.get("window");

  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [clearfield, setClearfield] = useState<boolean>(false);
  const [showfull, setShowFull] = useState<boolean>(true);
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      const fetchProducts = async () => {
        if (query.length < 1) {
          onSearchResults([]); // Clear results if the query is empty
          setShowSearch(false); // Hide search results
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const response = await fetch(
            `https://preeminent-macaron-3cd7d6.netlify.app/.netlify/functions/api/v1/search?query=${encodeURIComponent(
              query
            )}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data: Product[] = await response.json();
          onSearchResults(data); // Pass the results back to Home
          setShowSearch(data.length > 0); // Update search visibility
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }, 300); // Debounce for 300ms

    return () => clearTimeout(debounceFetch); // Cleanup timeout on unmount or query change
  }, [query, onSearchResults, setShowSearch]);

  return (
    <View className="flex flex-row items-center justify-between p-2 bg-gray-100">
      {showfull && (
        // <Text className="text-lg font-bold text-yellow-600">OneMarket</Text>
        //  {/* image logo */}
        <Image
          source={require("../../assets/images/gif/logo.png")}
          style={{ width: 100, height: 34, marginRight: 5, paddingLeft: 5 }}
        />
      )}
      <View className="flex flex-row items-center border-b border-gray-300">
        <FontAwesome name="search" size={15} color="#ccc" className="ml-5" />
        <TextInput
          placeholder={"Search ..."}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (text.length === 0) {
              setShowSearch(false); // Hide search results if input is cleared
            } else {
              setClearfield(true); //
            }
          }}
          style={{ width: width * 0.5, paddingLeft: 3 }} // Set width based on device size
          onFocus={() => {
            // Handle the focus event
            setShowSearch(true); // Optionally show search results when input is focused
            setShowFull(false);
          }}
          onBlur={() => {
            // Handle the blur event
            if (query.length === 0) {
              setShowSearch(false); // Hide search results if input is empty on blur
              if (inputRef.current) {
                inputRef.current.blur(); // Remove focus from the input
              }
            }
          }}
        />
        {clearfield && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              setClearfield(false);
              setShowFull(true);
            }}
          >
            <FontAwesome name="close" size={20} color="#ccc" className="mr-2" />
          </TouchableOpacity>
        )}
      </View>
      {showfull && (
        <View className="flex flex-row gap-4">
          <FontAwesome
            name="heart"
            size={21}
            color="lightgray"
            className="ml-4"
          />
          <FontAwesome
            name="bell"
            size={21}
            color="lightgray"
            className="ml-4"
          />
        </View>
      )}
    </View>
  );
};

export default Header;
