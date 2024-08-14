import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import imagess from "../api/files/1723616860800-164741114-image.jpg";

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [recepientData, setRecepientData] = useState();
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setMessage] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const route = useRoute();
  const { recepientId } = route.params;
  const navigation = useNavigation();

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://192.168.54.75:5000/messages/${userId}/${recepientId}`
      );
      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messags", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(
          `http://192.168.54.75:5000/user/${recepientId}`
        );

        const data = await response.json();
        setRecepientData(data);
      } catch (error) {
        console.log("error retrieving details", error);
      }
    };

    fetchRecepientData();
  }, []);
  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recepientId", recepientId);

      //if the message type id image or a normal text
      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);
      }

      const response = await fetch("http://192.168.54.75:5000/messages", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setMessage("");
        setSelectedImage("");
        fetchMessages();
      }
    } catch (err) {
      console.log("sending err", err);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#A770EF",
      },
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <Ionicons
              name="arrow-back-circle-outline"
              size={34}
              color="#a0a0a0"
            />
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 25,
                resizeMode: "cover",
                marginLeft: 10,
              }}
              source={{ uri: recepientData?.image }}
            />
            <Text
              style={{
                marginLeft: 8,
                fontSize: 18,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {recepientData?.name}
            </Text>
          </View>
        </Pressable>
      ),
    });
  }, [navigation, recepientData]);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      handleSend("image", result.assets[0].uri);
    }
  };
  return (
    <LinearGradient
      colors={["#A770EF", "#CF8BF3", "#c1a7c6"]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView>
          {messages.map((item, index) => {
            if (item.messageType === "text") {
              return (
                <Pressable
                  key={index}
                  style={[
                    item?.senderId?._id === userId
                      ? {
                          alignSelf: "flex-end",
                          backgroundColor: "#ce00bd",
                          padding: 8,
                          maxWidth: "60%",
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 7,
                          borderBottomRightRadius: 13,
                          margin: 10,
                        }
                      : {
                          alignSelf: "flex-start",
                          backgroundColor: "white",
                          padding: 8,
                          margin: 10,
                          borderRadius: 7,
                          maxWidth: "60%",
                        },
                  ]}
                >
                  <Text
                    style={[
                      item?.senderId?._id === userId
                        ? { fontSize: 16, color: "#dcdcdc" }
                        : { fontSize: 16, color: "black" },
                    ]}
                  >
                    {item.message}
                  </Text>
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 10,
                      color: "#404040",
                      marginTop: 5,
                    }}
                  >
                    {formatTime(item.timeStamp)}
                  </Text>
                </Pressable>
              );
            }
            if (item.messageType === "image") {
              const baseUrl = "http://192.168.54.75:8081/api/files/";
              const imageUrl = item.imageUrl;
              const filename = imageUrl.split("\\").pop();
              const source = baseUrl + filename;
              console.log(source);

              return (
                <Pressable
                  key={index}
                  style={[
                    item?.senderId?._id === userId
                      ? {
                          alignSelf: "flex-end",
                          backgroundColor: "#DCF8C6",
                          padding: 8,
                          maxWidth: "60%",
                          borderRadius: 7,
                          margin: 10,
                        }
                      : {
                          alignSelf: "flex-start",
                          backgroundColor: "white",
                          padding: 8,
                          margin: 10,
                          borderRadius: 7,
                          maxWidth: "60%",
                        },
                  ]}
                >
                  <View>
                    <Image
                      source={{ uri: source }}
                      style={{ width: 200, height: 200, borderRadius: 7 }}
                    />

                    <Text
                      style={{
                        textAlign: "right",
                        fontSize: 9,
                        position: "absolute",
                        right: 10,
                        bottom: 7,
                        color: "white",
                        marginTop: 5,
                      }}
                    >
                      {formatTime(item?.timeStamp)}
                    </Text>
                  </View>
                </Pressable>
              );
            }
          })}
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 15,
            borderTopWidth: 1,
            borderTopColor: "#dddddd",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              paddingHorizontal: 5,
              marginHorizontal: 4,
              paddingVertical: 3,
              borderRadius: 10,
              marginRight: 10,
              borderColor: "#dddddd",
            }}
          >
            <Entypo
              onPress={pickImage}
              style={{ paddingHorizontal: 5 }}
              name="camera"
              size={30}
              color="black"
            />
            <Feather
              style={{ paddingHorizontal: 5, marginLeft: 5 }}
              name="mic"
              size={28}
              color="black"
            />
          </View>

          <TextInput
            value={message}
            onChangeText={(text) => setMessage(text)}
            style={{
              flex: 1,
              height: 40,
              borderWidth: 1,
              borderColor: "#dddddd",
              borderRadius: 20,
              paddingHorizontal: 10,
              maxHeight: 100, // Set a max height if needed to limit the size
            }}
            placeholder="Type Your message..."
            multiline={true} // Enable multiline input
          />

          <Entypo
            onPress={handleEmojiPress}
            style={{ paddingHorizontal: 10 }}
            name="emoji-happy"
            size={30}
            color="black"
          />
          <Pressable onPress={() => handleSend("text")}>
            <Feather
              style={{ paddingRight: 8, paddingTop: 5 }}
              name="send"
              size={30}
              color="#e61384"
            />
          </Pressable>
        </View>
        {showEmojiSelector && (
          <EmojiSelector
            columns={8}
            showSearchBar={false}
            showSectionTitles={false}
            onEmojiSelected={(emoji) => {
              setMessage((prevMessage) => prevMessage + emoji);
            }}
            style={{ height: 250 }}
          />
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ChatMessagesScreen;
