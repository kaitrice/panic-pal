import React, { useState, useEffect, useRef } from 'react';
import {
    FlatList,
    Button,
    Text,
    TextInput,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import axios from 'axios'; // Import axios


// Replace with your actual OpenAI API key and manage it securely
const OPENAI_API_KEY = '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';

const Chat = () => {
    const systemMessage = {
        "role": 'system',
        "content": "The assistant is a cognitive behavioral therapist specializing in panic disorder with 20 years of experience. The assistant helps the user get through their panic attacks by reassuring them everything will be okay, helping them talk through catastrophic thoughts, and walking them through exercises that will deescalate the panic attack. Keep responses very concise and brief.",
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
            "role": 'user',
            "content": userInput,
        };

        const updatedChatHistory = [...chatHistory, userMessage];
        console.log('updatedChatHistory: ', updatedChatHistory);

        // Add user message to chat history
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // Clear user input
        setCurrentInput('');

        // Send user input to LLM API and get response
        const botMessage = await getBotResponse(updatedChatHistory);

        // Add bot response to chat history
        setMessages((prevMessages) => [...prevMessages, botMessage]);
    };

    const getBotResponse = async (messages) => {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const botMessage = {
                "role": 'assistant',
                "content": response.data.choices[0].message.content,
            };
            return botMessage;

        } catch (error) {
            console.error('Error getting bot response: ', error);
            return {
                "role": 'assistant',
                "content": 'Sorry, I am having trouble understanding that.',
            };
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <FlatList
                ref={flatListRef}
                data={chatHistory}
                keyExtractor={(item, index) => index.toString()}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                renderItem={({ item }) => {
                    if (item.role !== 'system') { // Check if the message role is not 'system'
                        return (
                            <View style={item.role === 'user' ? styles.userMessage : styles.botMessage}>
                                <Text>{item.content}</Text>
                            </View>
                        );
                    } else {
                        return null; // Do not render anything for 'system' role messages
                    }
                }}
            />
            <TextInput
                style={styles.input}
                value={userInput}
                onChangeText={setCurrentInput}
                placeholder="Type your message here..."
            />
            <Button title='Send' onPress={handleSend} />
        </KeyboardAvoidingView>
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
