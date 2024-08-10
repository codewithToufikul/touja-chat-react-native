import {
    Alert,
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import appLogo from "../assets/app-logo.png";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const LoginScreen = () => {
    const [click, setClick] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation()

    useEffect(() => {
      const checkLoginStatus = async () => {
        try {
          const token = await AsyncStorage.getItem("authToken");
  
          if (token) {
            navigation.replace("Home");
          } else {
            // token not found , show the login screen itself
          }
        } catch (error) {
          console.log("error", error);
        }
      };
  
      checkLoginStatus();
    }, []);

    const handleUserLogin = () =>{
      const user = {
        email: userEmail,
        password: password,
      }
      axios.post("http://192.168.165.75:5000/login", user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        navigation.replace("Home");
      })
      .catch((error) => {
        Alert.alert("Login Error", "Invalid email or password");
        console.log("Login Error", error);
      });
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <Image source={appLogo} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputView}>
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
        </View>
        <View style={styles.rememberView}>
          <View style={styles.switch}>
            <Switch
              value={click}
              onValueChange={setClick}
              trackColor={{ true: "green", false: "gray" }}
            />
            <Text style={styles.rememberText}>Remember Me</Text>
          </View>
          <View>
            <Pressable>
              <Text style={styles.forgetText}>Forgot Password?</Text>
            </Pressable>
          </View>
        </View>
  
        <View style={styles.buttonView}>
          <Pressable onPress={handleUserLogin} style={styles.button}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </Pressable>
        </View>
        <Text style={styles.footerText} onPress={()=>{navigation.navigate('Register')}}>
          Don't Have Account?<Text style={styles.signup}> Sign Up</Text>
        </Text>
      </SafeAreaView>
    );
  };
  
  export default LoginScreen;
  
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
    rememberView: {
      width: "100%",
      paddingHorizontal: 50,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      marginBottom: 8,
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
  