import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [recepientData, setRecepientData] = useState();
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageUri, setModalImageUri] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const route = useRoute();
  const { recepientId } = route.params;
  const navigation = useNavigation();

  const scrollViewRef = useRef(null);

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
        console.log("error showing messages", response.status.message);
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

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, [messages]);

  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recepientId", recepientId);

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
      headerTitle: selectedMessages.length > 0 ? ` selected` : "",
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
            {selectedMessages.length > 0 ? (
              <View
                style={{
                  marginLeft: 10,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "500" }}>
                  {selectedMessages.length}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
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
            )}
          </View>
        </Pressable>
      ),
      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginRight: 8 }}>
            <Ionicons name="arrow-redo-outline" size={24} color="black" />
            <Ionicons name="arrow-undo-outline" size={24} color="black" />
            <FontAwesome name="star-o" size={24} color="black" />
            <AntDesign onPress={() => deleteMessages(selectedMessages)} name="delete" size={24} color="red" />
          </View>
        ) : null,
    });
  }, [navigation, recepientData, selectedMessages]);

  const deleteMessages = async (messageIds) =>{
    try {
      const response = await fetch("http://192.168.54.75:5000/deleteMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messageIds }),
      });

      if (response.ok) {
        setSelectedMessages((prevSelectedMessages) =>
        prevSelectedMessages.filter((id) => !messageIds.includes(id))
      );

        fetchMessages();
      } else {
        console.log("error deleting messages", response.status);
      }
    } catch (error) {
      console.log("error deleting messages", error);
    }
  }
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      handleSend("image", result.assets[0].uri);
    }
  };

  const openImageModal = (uri) => {
    setModalImageUri(uri);
    setModalVisible(true);
  };

  const handleSelectMessage = (message) => {
    const isSelected = selectedMessages.includes(message._id);

    if (isSelected) {
      setSelectedMessages((previousMessages) =>
        previousMessages.filter((id) => id !== message._id)
      );
    } else {
      setSelectedMessages((previousMessages) => [
        ...previousMessages,
        message._id,
      ]);
    }
  };
  return (
    <LinearGradient
      colors={["#A770EF", "#CF8BF3", "#c1a7c6"]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView ref={scrollViewRef}>
          {messages.map((item, index) => {
            const isSelected = selectedMessages.includes(item._id);

            if (item.messageType === "text") {
              return (
                <Pressable
                  onLongPress={() => handleSelectMessage(item)}
                  key={index}
                  style={[
                    item?.senderId?._id === userId
                      ? {
                          alignSelf: "flex-end",
                          backgroundColor: isSelected ? "#c70039" : "#ce00bd", // Change color if selected
                          padding: 8,
                          maxWidth: "60%",
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 7,
                          borderBottomRightRadius: 13,
                          margin: 10,
                        }
                      : {
                          alignSelf: "flex-start",
                          backgroundColor: isSelected ? "#a0e4e0" : "#d2f5f7", // Change color if selected
                          padding: 8,
                          margin: 10,
                          borderTopLeftRadius: 7,
                          borderTopRightRadius: 12,
                          borderBottomLeftRadius: 13,
                          maxWidth: "60%",
                        },
                  ]}
                >
                  <Text
                    style={[
                      item?.senderId?._id === userId
                        ? {
                            fontSize: 16,
                            color: isSelected ? "#ffffff" : "#dcdcdc",
                          }
                        : {
                            fontSize: 16,
                            color: isSelected ? "#000000" : "#404040",
                          },
                    ]}
                  >
                    {item.message}
                  </Text>
                  <Text
                    style={[
                      item?.senderId?._id === userId
                        ? {
                            textAlign: "right",
                            fontSize: 10,
                            color: isSelected ? "#ffffff" : "black", // Change time color if selected
                            marginTop: 3,
                          }
                        : {
                            textAlign: "right",
                            fontSize: 9,
                            color: isSelected ? "#000000" : "#404040", // Change time color if selected
                            marginTop: 3,
                          },
                    ]}
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

              return (
                <Pressable
                  key={index}
                  onLongPress={() => handleSelectMessage(item)}
                  onPress={() => openImageModal(source)}
                  style={[
                    item?.senderId?._id === userId
                      ? {
                          alignSelf: "flex-end",
                          backgroundColor: isSelected ? "#c70039" : "#ce00bd",
                          maxWidth: "60%",
                          borderRadius: 7,
                          margin: 10,
                          padding: isSelected ? 3 : 0
                        }
                      : {
                          alignSelf: "flex-start",
                          margin: 10,
                          backgroundColor: isSelected ? "#c70039" : "#ce00bd",
                          borderRadius: 7,
                          maxWidth: "60%",
                          padding: isSelected ? 3 : 0
                        },
                  ]}
                >
                  <View>
                    <Image
                      source={{ uri: source }}
                      style={{ width: 230, height: 200, borderRadius: 7 }}
                    />

                    <Text
                      style={{
                        textAlign: "right",
                        fontSize: 10,
                        padding: 3,
                        borderRadius: 5,
                        position: "absolute",
                        right: 10,
                        bottom: 7,
                        color: "white",
                        backgroundColor: "#bebebe",
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

      {/* Full-screen Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={{ uri: modalImageUri }}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
};

export default ChatMessagesScreen;
