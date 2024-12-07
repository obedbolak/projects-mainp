import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Collapsible from "react-native-collapsible";
import CreateProduct from "@/app/Merchant/CreateProduct";
import MyProductList from "@/app/Merchant/MyProductList";

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

const ManageProducts: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-white pt-20">
      <ScrollView>
        <Text className="text-2xl font-bold mb-4 self-center">
          Manage Your Products
        </Text>

        <AccordionPanel
          summary="Add Product"
          isOpen={openIndex === 0}
          onToggle={() => handleToggle(0)}
        >
          <CreateProduct />
          {/* You can add your product form here */}
        </AccordionPanel>

        <AccordionPanel
          summary="Edit Product"
          isOpen={openIndex === 1}
          onToggle={() => handleToggle(1)}
        >
          <Text className="text-gray-700">
            {/* You can add your edit product form here */}
            Form to edit an existing product goes here.
          </Text>
          {/* You can add your edit product form here */}
        </AccordionPanel>

        <AccordionPanel
          summary="Delete Product"
          isOpen={openIndex === 2}
          onToggle={() => handleToggle(2)}
        >
          <Text className="text-gray-700">
            Confirmation and form to delete a product goes here.
          </Text>
          {/* You can add your delete product confirmation here */}
        </AccordionPanel>

        <AccordionPanel
          summary="My Products"
          isOpen={openIndex === 3}
          onToggle={() => handleToggle(3)}
        >
          <Text className="text-gray-700">
            List of products you have added goes here.
          </Text>
          <MyProductList />
          {/* You can render the list of products here */}
        </AccordionPanel>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageProducts;
