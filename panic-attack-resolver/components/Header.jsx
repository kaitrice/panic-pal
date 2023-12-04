import React from 'react';
import Sloth from './Sloth';
import {
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from 'react-native';

import {colors} from '../values/colors'
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native';

const Header = () => {
    const theme = useColorScheme();

    return (
        <SafeAreaView style={styles.outerContainer}>
        <View style={[theme == 'light' ? styles.lightThemeBg : styles.darkThemeBg, styles.container]}>
            <View style={styles.slothContainer}>
                <Sloth variant="variant3" style={styles.sloth} />
            </View>
            <View style={styles.textContainer}>
                <Text style={[theme == 'light' ? styles.lightThemeTxt : styles.darkThemeTxt, styles.title]}>Panic Pal</Text>
                <Text style={[theme == 'light' ? styles.lightThemeTxt : styles.darkThemeTxt, styles.subtitle]}>Panic Attack Resolver</Text>
            </View>
        </View>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: colors.brown,
        width: '100%',
        paddingTop: StatusBar.currentHeight || 40,
        paddingBottom: 20,
    },
    container: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lightThemeBg: {
        backgroundColor: 'white',
        // color: colors.darkBackgroundColor,
        color: '#fc8005',
    },
    darkThemeBg: {
        backgroundColor: '#212020',
        color: colors.appBackgroundColor,
    },
    slothContainer: {
        position: 'absolute', // Position the sloth absolutely
        top: -2,
        left: 0, // Align to the left of the screen
        right: 0, // Ensure it stretches across to the right
        alignItems: 'left',
    },
    textContainer: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: colors.defaultButtonColor,
        fontSize: 36,
        fontWeight: 'bold',
        
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    lightThemeTxt: {
        color: '#332F2E',
    },
    darkThemeTxt: {
        color: 'white',
    },
    sloth: {
        // Additional styles if needed
    },
});

export default Header;
