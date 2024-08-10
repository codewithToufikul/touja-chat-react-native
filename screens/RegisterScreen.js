import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import appLogo from "../assets/app-logo.png";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const navigation = useNavigation();

  const handleRegister = () =>{
    const user = {
      name: userName,
      email: userEmail,
      password: password,
      image: image,
    }
    axios.post("http://192.168.165.75:5000/users", user).then((response) => {
      console.log(response);
      Alert.alert(
        "Registration successful",
        "You have been registered Successfully"
      );
      setUserName("");
      setUserEmail("");
      setPassword("");
      setImage("");
    })
    .catch((error) => {
      console.error("Registration failed:", error);
      Alert.alert(
        "Registration Error",
        "An error occurred while registering: " + (error.response ? error.response.data.message : error.message)
      );
    });    
  }
  return (
    <SafeAreaView style={styles.container}>
      <Image source={appLogo} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Register</Text>
      <View style={styles.inputView}>
        <TextInput
          value={userName}
          onChangeText={setUserName}
          style={styles.input}
          placeholder="ENTER YOUR NAME"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          value={userEmail}
          onChangeText={setUserEmail}
          style={styles.input}
          placeholder="EMAIL"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
          placeholder="PASSWORD"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
        value={image}
        onChangeText={setImage}
          style={styles.input}
          placeholder="YOUR PROFILE IMAGE"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.buttonView}>
        <Pressable onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>REGISTER</Text>
        </Pressable>
      </View>
      <Text
        style={styles.footerText}
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        Already Have Account?<Text style={styles.signup}> Sign In</Text>
      </Text>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 70,
  },
  image: {
    height: 160,
    width: 170,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingVertical: 35,
    color: "#e61384",
  },
  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 5,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "#e61384",
    borderWidth: 1,
    borderRadius: 7,
  },
  switch: {
    flexDirection: "row",
    gap: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rememberText: {
    fontSize: 13,
  },
  forgetText: {
    fontSize: 11,
    color: "#e61384",
  },
  button: {
    backgroundColor: "#e61384",
    height: 45,
    width: "100%",
    border: "none",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonView: {
    width: "100%",
    paddingHorizontal: 50,
    marginTop: 13,
  },
  optionsText: {
    textAlign: "center",
    paddingVertical: 10,
    color: "gray",
    fontSize: 13,
    marginBottom: 6,
  },
  mediaIcons: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 23,
  },
  icons: {
    width: 40,
    height: 40,
  },
  footerText: {
    textAlign: "center",
    color: "gray",
    marginTop: 25,
  },
  signup: {
    color: "#e61384",
    fontSize: 13,
  },
});
