import React from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  View,
} from 'react-native'
import Header from './components/Header'
import Footer from './components/Footer'

const App = () => (
    <View style={styles.container}>
      <Header style={styles.top} />
      <View style={styles.middle} />
      <Footer style={styles.bottom} />
      <StatusBar style="auto" />
    </View>
)

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
    flex: 6,
  },
  bottom: {
    flex: 1,
  },
})

export default App
