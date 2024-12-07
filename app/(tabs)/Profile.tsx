import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import Collapsible from "react-native-collapsible";
import CustomButton from "../components/CustomButton";
import { useAuth } from "@/context/AuthContext";

interface AccordionPanelProps {
  summary: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionPanel: React.FC<AccordionPanelProps> = ({
  summary,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <View className="border border-gray-300 mb-2 rounded-lg">
      <TouchableOpacity
        onPress={onToggle}
        className="bg-gray-200 p-4 rounded-lg"
      >
        <Text className="text-lg font-semibold">{summary}</Text>
      </TouchableOpacity>
      <Collapsible collapsed={!isOpen}>
        <View className="p-4">{children}</View>
      </Collapsible>
    </View>
  );
};

const Accordion: React.FC = () => {
  const { signOut, userProfile, isAuthenticated } = useAuth();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // User information
  const user = userProfile;

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.map((n) => n.charAt(0).toUpperCase()).join("");
  };

  const [userDuration, setUserDuration] = useState("");

  // Function to calculate duration
  const calculateDuration = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();

    if (isNaN(createdDate.getTime())) {
      console.error("Invalid date:", createdAt);
      return "Unknown duration"; // Handle invalid date scenario
    }

    const durationInMilliseconds = now.getTime() - createdDate.getTime();

    const seconds = Math.floor((durationInMilliseconds / 1000) % 60);
    const minutes = Math.floor((durationInMilliseconds / 1000 / 60) % 60);
    const hours = Math.floor((durationInMilliseconds / 1000 / 3600) % 24);
    const days = Math.floor(durationInMilliseconds / 1000 / 3600 / 24);

    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      setUserDuration(calculateDuration(userProfile.createdAt));
    }
  }, [isAuthenticated, userProfile]);

  // Optionally, update the duration every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (userProfile) {
        setUserDuration(calculateDuration(userProfile.createdAt));
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup
  }, [userProfile]);

  if (!userProfile) {
    return <p>Loading user profile...</p>; // Loading state
  }

  return (
    <SafeAreaView className="flex-1 p-5">
      {/* Profile Picture Section */}
      <View className="flex items-center mb-4">
        <Image
          source={{
            uri: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=600",
          }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        {/* <View
          className="absolute bg-gray-500 rounded-full justify-center items-center"
          style={{ width: 100, height: 100 }}
        >
          <Text className="text-white text-3xl font-bold">
            {getInitials(user.fullName)}
          </Text>
        </View> */}
      </View>

      <AccordionPanel
        summary="Personal Information"
        isOpen={openIndex === 0}
        onToggle={() => handleToggle(0)}
      >
        <Text className="text-gray-700">Full Name: {user?.name}</Text>
        <Text className="text-gray-700">Email: {user?.email}</Text>
        <Text className="text-gray-700">
          Phone: {user?.phone === "12345678" ? "Add Phone" : `${user?.phone}`}
        </Text>
      </AccordionPanel>

      <AccordionPanel
        summary="Addresses"
        isOpen={openIndex === 1}
        onToggle={() => handleToggle(1)}
      >
        <Text className="text-gray-700">
          Billing Address:
          {user?.address === "st luis street"
            ? "Please Add An Address"
            : `${user?.address}`}
        </Text>
        <Text className="text-gray-700">Shipping Address: Same as Billing</Text>
      </AccordionPanel>

      <AccordionPanel
        summary="Order History"
        isOpen={openIndex === 2}
        onToggle={() => handleToggle(2)}
      >
        <Text className="text-gray-700">Order #12345 - Delivered</Text>
        <Text className="text-gray-700">Order #67890 - In Transit</Text>
      </AccordionPanel>

      <AccordionPanel
        summary="Payment Methods"
        isOpen={openIndex === 3}
        onToggle={() => handleToggle(3)}
      >
        <Text className="text-gray-700">Visa ending in 1234</Text>
        <Text className="text-gray-700">PayPal: johndoe@example.com</Text>
      </AccordionPanel>

      <AccordionPanel
        summary="Wishlist"
        isOpen={openIndex === 4}
        onToggle={() => handleToggle(4)}
      >
        <Text className="text-gray-700">Item 1: Cool Product</Text>
        <Text className="text-gray-700">Item 2: Another Product</Text>
      </AccordionPanel>

      <AccordionPanel
        summary="Notifications"
        isOpen={openIndex === 5}
        onToggle={() => handleToggle(5)}
      >
        <Text className="text-gray-700">Email Notifications: Enabled</Text>
        <Text className="text-gray-700">SMS Notifications: Disabled</Text>
        <Text>Singed In:</Text>
        <Text className="text-green-500"> {userDuration}</Text>
      </AccordionPanel>

      <AccordionPanel
        summary="Security Settings"
        isOpen={openIndex === 6}
        onToggle={() => handleToggle(6)}
      >
        <Text className="text-gray-700">
          Two-Factor Authentication: Enabled
        </Text>
        <Text className="text-gray-700">Change Password</Text>
      </AccordionPanel>

      <CustomButton theme="primary" onPress={() => signOut()}>
        <Text className="text-white">log out</Text>
      </CustomButton>
    </SafeAreaView>
  );
};

export default Accordion;
