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

const CustomTextButton = ({ text, onPress, disabled, circle, color }) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[
            styles.button,
            circle ? styles.circle : styles.squoval,
            { backgroundColor: color },
        ]}
    >
        <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
)

const Footer = ({ setCurrentScreen }) => {
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

  return (
    <View style={styles.container}>
        <CustomIconButtonI iconName="ios-home" onPress={() => setCurrentScreen('Chat')} color={colors.defaultButtonColor} />
        <CustomIconButtonF iconName="circle" onPress={() => setCurrentScreen('Breathing')} color={colors.defaultButtonColor} />
        <CustomTextButton text="SOS" onPress={() =>  handleSOSClick()} circle color={colors.sosButtonColor} />
        <CustomIconButtonI iconName="calendar" onPress={() => setCurrentScreen('Calendar')} color={colors.defaultButtonColor} />
        <CustomIconButtonI iconName="settings" onPress={() => setCurrentScreen('Settings')} color={colors.defaultButtonColor} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around', // This will distribute space around the buttons equally
        alignItems: 'center', // This ensures all buttons are aligned in the center vertically
        paddingBottom: 20,
    },
    button: {
        height: 70, // TODO: Adjust height to be dynamic
        flex: 1, // This allows each button to grow and take an equal amount of space
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
        padding: 10, // You can adjust padding to ensure text fits well within the button
        // Removed static width and height from here
    },
    squoval: {
        borderColor: '#332F2E',
        borderRadius: 20,
        // Adjust padding if necessary, instead of a fixed width and height
    },
    circle: {
        borderRadius: 35, // This will create a circle if the width and height are equal
        // Adjust padding if necessary
    },
    buttonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.appBackgroundColor,
    },
});

export default Footer;