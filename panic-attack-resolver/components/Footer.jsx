import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native'

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
)

const Footer = ({ setCurrentScreen }) => (
    <View style={styles.container}>
        <CustomButton title="Home" onPress={() => setCurrentScreen('Chat')} color="#80B9E2" />
        <CustomButton title="Breathing" onPress={() => setCurrentScreen('Breathing')} color="#80B9E2" />
        <CustomButton title="SOS" onPress={() => setCurrentScreen('SOS')} circle color="#FF0000" />
        <CustomButton title="Calendar" onPress={() => setCurrentScreen('Calendar')} color="#80B9E2" />
        <CustomButton title="More" onPress={() => setCurrentScreen('Settings')} color="#80B9E2" />
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        // backgroundColor: 'white',
        justifyContent: 'center',
        padding: 10,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
    },
    squoval: {
        borderColor: '#332F2E',
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
        color: '#F2F2F1',
    },
})

export default Footer
