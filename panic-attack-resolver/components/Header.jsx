import React from 'react'
import Sloth from './Sloth'
import {
    StyleSheet,
    Text,
    View,
  } from 'react-native'
  
const Header = () => (
    <View style={styles.header}>
        <Sloth variant="variant1"></Sloth>
        <Text style={styles.title}>Panic Pal</Text>
        <Text style={styles.subtitle}>Panic Attack Resolver</Text>
    </View>
)

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#80B9E2',
        fontSize: 36,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#332F2E',
        fontSize: 18,
        fontWeight: 'bold',
    },
})

export default Header
