import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequest from "../component/FriendRequest";

const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);
  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://192.168.6.218:5000/friend-request/${userId}`
      );
      if (response.status === 200) {
        const friendRequestsData = response.data.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.image,
        }));

        setFriendRequests(friendRequestsData);
      }
    } catch (err) {
      console.log("error message", err);
    }
  };
  return (
    <View>
      {friendRequests.length > 0 ? (
        <View style={{ backgroundColor: "#6a5acd", paddingBottom: 30, paddingTop: 30, paddingHorizontal: 30, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}>
          <Text style={{ fontSize: 17, fontWeight: 400, color: '#fff' }}>
            Accept The Friend Requests, And Start Conversation...💝
          </Text>
        </View>
      ) : (
        <Text
          style={{
            fontSize: 18,
            color: "#e61384",
            marginTop: "90%",
            marginHorizontal: 25,
          }}
        >
          You Have No Friend Requests Yet !! 😢
        </Text>
      )}
      <View style={{marginTop: 12,}}>
        {friendRequests.map((item, index) => (
          <FriendRequest
            key={index}
            item={item}
            friendRequests={friendRequests}
            setFriendRequests={setFriendRequests}
          />
        ))}
      </View>
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({});
