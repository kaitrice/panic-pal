import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  View,
} from 'react-native'
import Header from './components/Header'
import Footer from './components/Footer'

import {colors} from './values/colors'


// Importing individual screen components
import Chat from './components/Chat'
import Settings from './components/Settings'
import SOS from './components/SOS'
import HotlineSOS from './components/HotlineSOS'
import Breathing from './components/Breathing'
import Calendar from './components/Calendar'
import Login from './components/Login'


const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Login');
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <Login />
      case 'Chat':
        return <Chat />
      case 'Breathing':
        return <Breathing />
      case 'SOS':
        return <SOS />
      case 'HotlineSOS':
        return <HotlineSOS />
      case 'Calendar':
        return <Calendar />
      case 'Settings':
        return <Settings />
      default:
        return <Login />
    }
  };

  return (
    <View style={styles.container}>
      <Header style={styles.top} />
      <View style={styles.middle}>
        {renderScreen()}
      </View>
      <Footer style={styles.bottom} setCurrentScreen={setCurrentScreen} />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackgroundColor,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  top: {
    flex: 1,
  },
  middle: {
    flex: 7,
  },
  bottom: {
    flex: 1,
  },
})

export default App
