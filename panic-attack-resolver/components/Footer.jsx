import React from 'react';
import {
    Button,
    StyleSheet,
    View,
} from 'react-native'

const Footer = () => (
    <View className="footer">
        <Button 
            title="Home"
        />
        <Button 
            title="Breathing"
            disabled
        />
        <Button 
            title="SOS" 
            color="#FF0000"
            accessibilityLabel="Contact Family or Friends"
        />
        <Button 
            title="Calendar"
            disabled
        />
        <Button 
            title="More"
        />
    </View>
);

const styles = StyleSheet.create({
    SOS: {
        color: '#FF0000',
        fontSize: 18,
        fontWeight: 'bold',
    },
})

export default Footer;