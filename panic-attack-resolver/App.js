import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  View,
} from 'react-native'
import Header from './components/Header'
import Footer from './components/Footer'


// Importing individual screen components
import Chat from './components/Chat'
import Settings from './components/Settings'
import SOS from './components/SOS'
import Breathing from './components/Breathing'
import Calendar from './components/Calendar'
import Test from './components/Test'

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Test');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Chat':
        return <Chat />
      case 'Breathing':
        return <Breathing />
      case 'SOS':
        return <SOS />
      case 'Calendar':
        return <Calendar />
      case 'Settings':
        return <Settings />
      default:
        return <Test />
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
    backgroundColor: '#F2F2F1',
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
