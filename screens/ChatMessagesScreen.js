import React from 'react';
import { View, Text, KeyboardAvoidingView, ScrollView, TextInput, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Entypo from '@expo/vector-icons/Entypo';

const ChatMessagesScreen = () => {
  return (
    <LinearGradient
      colors={['#A770EF', '#CF8BF3', '#FDB99B']}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView>
        <ScrollView>

        </ScrollView>
        <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
        }}
      >
        <Entypo style={{paddingRight: 10}} name="emoji-happy" size={30} color="black" />

        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type Your message..."
        />
<Entypo style={{paddingHorizontal: 10}} name="camera" size={30} color="black" />
        <Pressable
          onPress={() => handleSend("text")}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ChatMessagesScreen;
