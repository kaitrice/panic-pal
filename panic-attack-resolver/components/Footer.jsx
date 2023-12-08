import React from "react";
import { StyleSheet, View, Text, Alert, TouchableOpacity } from "react-native";
import * as Contacts from "expo-contacts";

import {colors} from '../values/colors'
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const CustomIconButtonI = ({ iconName, onPress, disabled, circle, color }) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[
            styles.button,
            circle ? styles.circle : styles.squoval,
            { backgroundColor: color },
        ]}
    >
        <Ionicons name={iconName} size={24} color="white" />
    </TouchableOpacity>
)

const CustomIconButtonF = ({ iconName, onPress, disabled, circle, color }) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[
            styles.button,
            circle ? styles.circle : styles.squoval,
            { backgroundColor: color },
        ]}
    >
        <Feather name={iconName} size={24} color="white" />
    </TouchableOpacity>
)

const Footer = ({ setCurrentScreen , currentScreen}) => {
  const handleSOSClick = async () => {
    Alert.alert(
      "Panic Pal would like to access your contacts",
      "We need to access your contacts so you can quickly call a loved one when you need them most.",
      [
        {
          text: "Don't Allow",
          onPress: () => {
            setCurrentScreen("HotlineSOS");
            console.log("Permission denied");
          },
        },
        {
          text: "OK",
          onPress: async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === "granted") {
              console.log("Permission granted");
              setCurrentScreen("SOS");
            } else {
              console.log("Permission denied");
              setCurrentScreen("HotlineSOS");
            }
          },
        },
      ]
    );
  };

  const getCurrentScreenColor = (screen)  => {
    if (screen == 'SOS') {
      return colors.sosButtonColor;
    }
    return currentScreen === screen ? colors.loginButtonColor : colors.defaultButtonColor;
  }

  return (
    <View style={styles.container}>
        <CustomIconButtonI 
          iconName="ios-home" 
          onPress={() => setCurrentScreen('Chat')} 
          color={getCurrentScreenColor('Chat')} 
        />
        <CustomIconButtonF 
          iconName="circle" 
          onPress={() => setCurrentScreen('Breathing')} 
          color={getCurrentScreenColor('Breathing')} 
        />
        <CustomIconButtonF 
          iconName="phone" 
          onPress={() =>  handleSOSClick()} circle 
          color={getCurrentScreenColor('SOS')} 
        />
        <CustomIconButtonI 
          iconName="calendar" 
          onPress={() => setCurrentScreen('Calendar')} 
          color={getCurrentScreenColor('Calendar')} 
        />
        <CustomIconButtonI 
          iconName="settings"
          onPress={() => setCurrentScreen('Settings')} 
          color={getCurrentScreenColor('Settings')} 
        />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around', 
        alignItems: 'center', 
        paddingBottom: 20,
    },
    button: {
        height: 70, 
        flex: 1, 
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
        padding: 10,
    },
    squoval: {
        borderColor: '#332F2E',
        borderRadius: 20,
    },
    circle: {
        borderRadius: 35, 
    },
    buttonText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default Footer;