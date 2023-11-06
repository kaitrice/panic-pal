import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native'

import {colors} from '../values/colors'

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
        <CustomButton title="Home" onPress={() => setCurrentScreen('Chat')} color={colors.defaultButtonColor} />
        <CustomButton title="Breathing" onPress={() => setCurrentScreen('Breathing')} color={colors.defaultButtonColor} />
        <CustomButton title="SOS" onPress={() => setCurrentScreen('SOS')} circle color={colors.sosButtonColor} />
        <CustomButton title="Calendar" onPress={() => setCurrentScreen('Calendar')} color={colors.defaultButtonColor} />
        <CustomButton title="More" onPress={() => setCurrentScreen('Settings')} color={colors.defaultButtonColor} />
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
        color: colors.appBackgroundColor,
    },
})

export default Footer
