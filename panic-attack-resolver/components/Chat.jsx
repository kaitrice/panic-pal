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
import OpenAI from "openai";
// Replace with your actual OpenAI API key and manage it securely
const OPENAI_API_KEY = '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';

const Chat = () => {
    // const openai = new OpenAI({
    //     apiKey: OPENAI_API_KEY,
    // });

    const systemMessage = {
        "id": Date.now(),
        "role": 'system',
        "content": "You are a cognitive behavioral therapist specializing in panic disorder with 20 years of experience. You help people get through their panic attacks by reassuring them everything will be okay, helping them talk through catastrophic thoughts, and walking them through exercises that will deescalate the panic attack. Keep your responses shorter than 100 words in order to respond quickly.",
    };
    const [userInput, setCurrentInput] = useState('');
    const [chatHistory, setMessages] = useState([systemMessage]);
    const flatListRef = useRef();

    useEffect(() => {
        // Automatically scroll to the bottom whenever the chatHistory updates
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [chatHistory]);

    const handleSend = async () => {
        const userMessage = {
            "id": Date.now(),
            "role": 'user',
            "content": userInput,
        };

        // Add user message to chat history
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // Clear user input
        setCurrentInput('');

        // Send user input to LLM API and get response
        console.log('chatHistory: ', chatHistory);
        console.log('typeof chatHistory: ', typeof chatHistory);
        console.log(Array.isArray(chatHistory)); // This will return true if chatHistory is an array
        console.log('chatHistory[0]: ', chatHistory[0]);
        console.log('typeof chatHistory[0]: ', typeof chatHistory[0]);
        const botMessage = await getBotResponse(chatHistory);

        // Add bot response to chat history
        setMessages((prevMessages) => [...prevMessages, botMessage]);
    };

    const getBotResponse = async (messages) => {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        "id": Date.now(),
                        "role": 'system',
                        "content": "You are a cognitive behavioral therapist specializing in panic disorder with 20 years of experience. You help people get through their panic attacks by reassuring them everything will be okay, helping them talk through catastrophic thoughts, and walking them through exercises that will deescalate the panic attack. Keep your responses shorter than 100 words in order to respond quickly.",
                        },
                        { "role": 'user', "content": "I'm having a panic attack right now. I feel like I'm going to die." }
                    ],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('response: ', response);

            const botMessage = {
                "id": Date.now(),
                "role": 'bot',
                "content": response.data.choices[0].message.content,
            };
            return botMessage;
        } catch (error) {
            console.error('Error getting bot response: ', error);
            return {
                "id": Date.now(),
                "role": 'assistant',
                "content": 'Sorry, I am having trouble understanding that.',
            };
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={chatHistory}
                keyExtractor={(item) => item["id"].toString()}
                renderItem={({ item }) => (
                    <View style={item["role"] === 'user' ? styles.userMessage : styles.botMessage}>
                        <Text>{item["content"]}</Text>
                    </View>
                )}
            />
            <TextInput
                style={styles.input}
                value={userInput}
                onChangeText={setCurrentInput}
                placeholder="Type your message here..."
            />
            <Button title='Send' onPress={handleSend} />
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
