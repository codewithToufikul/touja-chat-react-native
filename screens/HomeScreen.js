import { Image, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import { UserType } from "../UserContext";
import User from "../component/User";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [currentUser, setCurrentUser] = useState();

  function base64Decode(base64) {
    return Buffer.from(base64, "base64").toString("utf-8");
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.log("No token found");
          return;
        }
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          console.log("Invalid token format");
          return;
        }
        const payload = JSON.parse(base64Decode(tokenParts[1]));
        const userId = payload.userId;
        if (!userId) {
          console.log("No userId found in token");
          return;
        }
        setUserId(userId);
        const response = await axios.get(
          `http://192.168.54.75:5000/userss/${userId}`
        );
        setUsers(response.data);
      } catch (error) {
        console.log(
          "Error fetching users",
          error.response ? error.response.data : error.message
        );
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `http://192.168.54.75:5000/users/current-user/${userId}`
        );
        setCurrentUser(response.data);
      } catch (err) {
        console.log("Fetch error", err);
      }
    };

    if (userId) {
      fetchCurrentUser();
    }
  }, [userId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text
          style={{
            fontSize: 27,
            fontWeight: "bold",
            color: "#e61384",
            marginTop: 24,
            marginBottom: 10,
          }}
        >
          TouJa Chat
        </Text>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            marginTop: 24,
            marginBottom: 10,
          }}
        >
          <Ionicons
            onPress={() => navigation.navigate("Chats")}
            name="chatbox-ellipses-outline"
            size={27}
            color="black"
          />
          <MaterialIcons
            onPress={() => navigation.navigate("Friends")}
            name="people-outline"
            size={28}
            color="black"
          />
        </View>
      ),
    });
  }, []);

  return (
    <View>
      <View style={{}}>
        {currentUser ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              padding: 10,
              paddingVertical: 20,
              backgroundColor: "#b8dedd",
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
              marginBottom: 20,
            }}
          >
            <Image
              style={{
                width: 70,
                height: 70,
                borderRadius: 25,
                resizeMode: "cover",
              }}
              source={{ uri: currentUser.image }}
            />
            <Text style={{ fontSize: 24, color: '#383b3b' }}>
              {currentUser.name.slice(0, 16)}
            </Text>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
      <View>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;
