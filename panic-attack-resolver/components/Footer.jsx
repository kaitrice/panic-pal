import React from 'react'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native'
import CustomButton from './Button'


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
        justifyContent: 'center',
        padding: 10,
    },
})

export default Footer
