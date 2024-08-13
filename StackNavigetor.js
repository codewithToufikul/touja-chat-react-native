import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./screens/HomeScreen";
import FriendsScreen from "./screens/FriendsScreen";
import ChatsScreen from "./screens/ChatsScreen";
import ChatMessagesScreen from "./screens/ChatMessagesScreen";


const StackNavigetor = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Friends" component={FriendsScreen}/>
        <Stack.Screen name="Chats" component={ChatsScreen}/>
        <Stack.Screen name="Messages" component={ChatMessagesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigetor;

const styles = StyleSheet.create({});
