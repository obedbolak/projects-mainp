// Chat.tsx
import React, { useEffect, useState } from "react";
import { View, TextInput, Button, FlatList, Text } from "react-native";
import io from "socket.io-client";

interface Message {
  message: string;
  sender: string;
}

const socket = io("http://localhost:8888/.netlify/functions/api"); // Update with your server URL

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    socket.on("loadMessages", (messages: Message[]) => {
      setMessages(messages);
    });

    socket.on("receiveMessage", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("loadMessages");
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("sendMessage", { message: input, sender: "User" }); // Replace 'User' with actual user data
      setInput("");
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.sender}: {item.message}
          </Text>
        )}
      />
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type a message"
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

export default Chat;
