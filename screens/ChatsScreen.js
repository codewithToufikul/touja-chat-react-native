import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../component/UserChat';

const ChatsScreen = () => {
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();

    useEffect(() => {
      const acceptedFriendsList = async () => {
        try {
          const response = await fetch(
            `http://192.168.54.75:5000/accepted-friends/${userId}`
          );
          const data = await response.json();
  
          if (response.ok) {
            setAcceptedFriends(data);
          }
        } catch (error) {
          console.log("error showing the accepted friends", error);
        }
      };
  
      acceptedFriendsList();
    }, []);
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable>
                {acceptedFriends.map((item, index) => (
                    <UserChat key={index} item={item} />
                ))}
            </Pressable>
        </ScrollView>
    );
}

export default ChatsScreen;

const styles = StyleSheet.create({});
