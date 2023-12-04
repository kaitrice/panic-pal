import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  View,
  useColorScheme,
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
  const theme = useColorScheme();
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <Login setCurrentScreen={setCurrentScreen} />
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
        return <Login setCurrentScreen={setCurrentScreen} />
    }
  };

  return (
    <View style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.container]}>
      <Header style={styles.top} />
      <View style={styles.middle}>
        {renderScreen()}
      </View>
      {/* {currentScreen !== 'Login' && ( */}
        <Footer style={styles.bottom} setCurrentScreen={setCurrentScreen} currentScreen={currentScreen} />
      {/* )} */}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lightTheme: {
    backgroundColor: colors.appBackgroundColor,
    // color: colors.darkBackgroundColor,
    color: '#fc8005',
  },
  darkTheme: {
    backgroundColor: colors.darkBackgroundColor,
    color: colors.appBackgroundColor,
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
