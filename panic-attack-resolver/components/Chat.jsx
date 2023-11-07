import React, { useState } from 'react'
import {
  FlatList,
  Button,
  Text,
  TextInput,
  View,
} from 'react-native'

// TODO remove once retrieving from LLM
const botMessages = [
    'Hi Pal!',
    'How are you doing?',
    'Thanks for using PanicPal!',
]

const Chat = () => {
  const [userInput, setCurrentInput] = useState('')
  const [chatHistory, setMessages] = useState([])

  const handleSend = () => {
    getUserMessage()
    getBotResponse()
    setCurrentInput('')
    // printMessages() // test purposes only
  }

  const getUserMessage = () => {
    const userMessage = {
      id: Date.now(),
      text: userInput,
      sender: 'user',
    }
    setUserMessage(userMessage)
  }
  
  const setUserMessage = (userMessage) => {
    console.log("userMessage\n", userMessage) // messages getting pulled
    // setMessages((prevMessages) => [...prevMessages, userMessage])
  }

  const getBotResponse = () => {
    // TODO update to retrieve from LLM
    const randomIndex = Math.floor(Math.random() * botMessages.length)
    const botInput = botMessages[randomIndex]
  
    const botMessage = {
      id: Date.now(),
      text: botInput,
      sender: 'bot',
    }
    setBotMessage(botMessage)
  }

  const setBotMessage = (botMessage) => {
    console.log("botMessage\n", botMessage) // messages getting pulled
    // setMessages((prevMessages) => [...prevMessages, botMessage])
  }

  const printMessages = () => {
    console.log("messages\n", chatHistory) // messages getting stored
  }

  return (
    <View>
      <FlatList 
        data={chatHistory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.text}
          </Text>
        )}
      />
      <TextInput 
        value={userInput}
        onChangeText={setCurrentInput}
        placeholder="Type your message here..."
      />
      <Button title='send' onPress={handleSend}/>
    </View>
  )
}


export default Chat
