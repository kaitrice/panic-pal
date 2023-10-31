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
      <Header></Header>
      <Footer></Footer>
      <StatusBar style="auto" />
    </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F1',
    alignItems: 'center',
    // justifyContent: 'center',
  },
})

export default App
