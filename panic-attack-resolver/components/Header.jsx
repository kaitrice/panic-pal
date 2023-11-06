import React from 'react';
import Sloth from './Sloth';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {colors} from '../values/colors'

const Header = () => (
    <View style={styles.container}>
        <View style={styles.slothContainer}>
            <Sloth variant="variant3" style={styles.sloth} />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.title}>Panic Pal</Text>
            <Text style={styles.subtitle}>Panic Attack Resolver</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        paddingTop: 40,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    slothContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
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