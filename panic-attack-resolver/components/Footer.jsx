import React from "react";
import { StyleSheet, View, Text, Alert, TouchableOpacity } from "react-native";
import * as Contacts from "expo-contacts";

import { colors } from "../values/colors";

const CustomButton = ({ title, onPress, disabled, circle, color }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      styles.button,
      circle ? styles.circle : styles.squoval,
      { backgroundColor: color },
    ]}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

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
      <CustomButton
        title="Home"
        onPress={() => setCurrentScreen("Chat")}
        color={colors.defaultButtonColor}
      />
      <CustomButton
        title="Breathing"
        onPress={() => setCurrentScreen("Breathing")}
        color={colors.defaultButtonColor}
      />
      <CustomButton
        title="SOS"
        onPress={() => handleSOSClick()}
        circle
        color={colors.sosButtonColor}
      />
      <CustomButton
        title="Calendar"
        onPress={() => setCurrentScreen("Calendar")}
        color={colors.defaultButtonColor}
      />
      <CustomButton
        title="More"
        onPress={() => setCurrentScreen("Settings")}
        color={colors.defaultButtonColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    // backgroundColor: 'white',
    justifyContent: "center",
    paddingBottom: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
  },
  squoval: {
    borderColor: "#332F2E",
    width: 70,
    height: 70,
    borderRadius: 20,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.appBackgroundColor,
  },
});

export default Footer;