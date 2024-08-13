import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
  const { userId } = useContext(UserType);
  const navigation = useNavigation();

  const acceptRequest = async (friendRequestId) => {
    try {
      const response = await fetch(
        "http://192.168.54.75:5000/friend-request/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: friendRequestId,
            recepientId: userId,
          }),
        }
      );

      if (response.ok) {
        setFriendRequests(
          friendRequests.filter((request) => request._id !== friendRequestId)
        );
        navigation.navigate("Chats");
      }
    } catch (err) {
      console.log("error accepting the friend request", err);
    }
  };

  return (
    <Pressable
      style={{
        borderWidth: 1,
        paddingVertical: 10,
        borderColor: '#bebebe',
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 5,
      }}
    >
      <Image
        style={{ 
          width: 60, 
          height: 60, 
          borderRadius: 50, 
          borderWidth: 2, 
          borderColor: '#e61384' 
        }}
        source={{ uri: item.image }}
      />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text
          style={{ 
            fontSize: 20, 
            fontWeight: "bold" 
          }}
        >
          {item?.name}
        </Text>
        <Text>sent you a friend request!!</Text>
      </View>

      <Pressable
        onPress={() => acceptRequest(item._id)}
        style={{ 
          backgroundColor: "#0066b2", 
          padding: 12, 
          borderRadius: 6 
        }}
      >
        <Text style={{ textAlign: "center", color: "white", fontSize: 15 }}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});
