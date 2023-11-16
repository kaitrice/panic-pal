import React from 'react';
import Sloth from './Sloth';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {colors} from '../values/colors'
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native';

const Header = () => (
    <SafeAreaView style={styles.outerContainer}>
        <View style={styles.container}>
            <View style={styles.slothContainer}>
                <Sloth variant="variant3" style={styles.sloth} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Panic Pal</Text>
                <Text style={styles.subtitle}>Panic Attack Resolver</Text>
            </View>
        </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: '#524434',
        width: '100%',
        paddingTop: StatusBar.currentHeight || 40,
        paddingBottom: 20,
    },
    container: {
        backgroundColor: '#ffffff',
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slothContainer: {
        // flex: 1,
        // alignItems: 'flex-start',
        // justifyContent: 'center',
        position: 'absolute', // Position the sloth absolutely
        // top: StatusBar.currentHeight || 40, // Start at the absolute top of the screen
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
        color: '#332F2E',
        fontSize: 18,
        fontWeight: 'bold',
    },
    sloth: {
        // Additional styles if needed
    },
});

export default Header;