import React from 'react'
import {
    StyleSheet,
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

const styles = StyleSheet.create({
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
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
    },
})

export default CustomButton