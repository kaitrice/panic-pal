import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

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

const Footer = () => (
    <View style={styles.container}>
        <CustomButton title="Home" onPress={() => {}} color="#007AFF" />
        <CustomButton title="Breathing" onPress={() => {}} disabled color="#BFBFBF" />
        <CustomButton title="SOS" onPress={() => {}} circle color="#FF0000" />
        <CustomButton title="Calendar" onPress={() => {}} disabled color="#BFBFBF" />
        <CustomButton title="More" onPress={() => {}} color="#007AFF" />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'center',
        padding: 10,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
    },
    squoval: {
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
        fontWeight: 'bold',
        color: 'white',
    },
});

export default Footer;
