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
        const botMessage = await getBotResponse(chatHistory);

        // Add bot response to chat history
        setMessages((prevMessages) => [...prevMessages, botMessage]);
    };

    const getBotResponse = async (input) => {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: chatHistory,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

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
