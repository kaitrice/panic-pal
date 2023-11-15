import React, { useState, useEffect, useRef } from 'react';
import {
  FlatList,
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
} from 'react-native';
import axios from 'axios'; // Import axios

// Replace with your actual OpenAI API key and manage it securely
const OPENAI_API_KEY = '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';

const Chat = () => {
  const [userInput, setCurrentInput] = useState('');
  const [chatHistory, setMessages] = useState([]);
  const flatListRef = useRef();

  useEffect(() => {
    // Automatically scroll to the bottom whenever the chatHistory updates
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);

  const handleSend = async () => {
    const userMessage = {
      id: Date.now(),
      text: userInput,
      sender: 'user',
    };

    // Add user message to chat history
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Clear user input
    setCurrentInput('');

    // Send user input to LLM API and get response
    const botMessage = await getBotResponse(userInput);
    
    // Add bot response to chat history
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  const getBotResponse = async (input) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { "role": "system", "content": "You are a helpful assistant." },
            { "role": "user", "content": input }
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const botMessage = {
        id: Date.now(),
        text: response.data.choices[0].message.content,
        sender: 'bot',
      };
      return botMessage;
    } catch (error) {
      console.error('Error getting bot response: ', error);
      return {
        id: Date.now(),
        text: 'Sorry, I am having trouble understanding that.',
        sender: 'bot',
      };
    }
  };

  return (
    <View style={styles.container}>
      <FlatList 
        ref={flatListRef}
        data={chatHistory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={item.sender === 'user' ? styles.userMessage : styles.botMessage}>
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <TextInput 
        style={styles.input}
        value={userInput}
        onChangeText={setCurrentInput}
        placeholder="Type your message here..."
      />
      <Button title='Send' onPress={handleSend}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  userMessage: {
    padding: 10,
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    borderRadius: 10,
    marginBottom: 5,
  },
  botMessage: {
    padding: 10,
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginBottom: 5,
  },
});

export default Chat;
