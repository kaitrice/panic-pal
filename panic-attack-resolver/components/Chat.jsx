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
    Keyboard,
    TouchableOpacity
} from 'react-native';
import axios from 'axios'; // Import axios
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../values/colors'
AsyncStorage.removeItem('interventions');

const Chat = () => {
    const systemMessage = {
        "role": 'system',
        "content": "The assistant is a cognitive behavioral therapist specializing in panic disorder with 20 years of experience. The assistant helps the user get through their panic attacks by reassuring them everything will be okay, helping them talk through catastrophic thoughts, and walking them through exercises that will deescalate the panic attack. Keep responses very concise and brief.",
    };
    const [interventionPrompt, setInterventionPrompt] = useState('');
    const [userInput, setCurrentInput] = useState('');
    const [chatHistory, setMessages] = useState([systemMessage]);
    const flatListRef = useRef();
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [inputAreaHeight, setInputAreaHeight] = useState(0);

    const [isChatHistoryLoading, setIsChatHistoryLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('chatHistory').then((value) => {
            const jsonValue = JSON.parse(value);
            if (jsonValue !== null) {
                console.log("got history")
                setMessages(jsonValue)
                console.log(jsonValue)
                setIsChatHistoryLoading(false);
            }
            else {
                //console.log("set default chat history")
                setIsChatHistoryLoading(false);
            }
        });
    }, [])


    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                // Scroll to end of FlatList
                if (flatListRef.current) {
                    flatListRef.current.scrollToEnd({ animated: true });
                }
            }
        );

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [chatHistory]);

    useEffect(() => {
        AsyncStorage.getItem('interventions').then((value) => {
            if (value !== null) {
                setInterventionPrompt(JSON.parse(value));
            } else {
                // Handle the case where 'interventions' not stored
                const defaultInterventions = ['Grounding', 'Breathing', 'Reassurance'];
                setDataAsync(defaultInterventions);
            }
        })
    }, []);

    async function setDataAsync(value) {
        AsyncStorage.setItem('interventions', JSON.stringify(value))
        .then(() => {
            setInterventionPrompt(value);
        })
        .catch((e) => {
            console.error("Error setting interventions:", e);
        });
    }

    if (isChatHistoryLoading) {
        //console.log("loading")
        return <View><Text>Loading...</Text></View>;
    }

    const handleSend = async () => {
        const userMessage = {
            "role": 'user',
            "content": userInput,
        };

        let localHistory = chatHistory;

        localHistory = [...localHistory, userMessage];
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setCurrentInput('');
        startLoadingMessage();


        const botMessage = await getBotResponse([...chatHistory, userMessage]);
        stopLoadingMessage();
        localHistory = [...localHistory, botMessage];
        setMessages((prevMessages) => [...prevMessages, botMessage]);


        saveChatHistory(localHistory);

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const sendPrompt = (prompt) => {
        setCurrentInput(prompt);
        handleSend();
    }

    let loadingInterval = null;

    const startLoadingMessage = () => {
        const messages = [".. ", "...", ".  "];
        let messageIndex = 0;
    
        setMessages(prevMessages => [...prevMessages, { role: 'loading', content: '.  ' }]);
    
        loadingInterval = setInterval(() => {
            const newContent = messages[messageIndex];
            messageIndex = (messageIndex + 1) % messages.length;
    
            // Update the content of the loading message in chat history
            setMessages(prevMessages => {
                const newMessages = [...prevMessages];
                const loadingMessageIndex = newMessages.findIndex(m => m.role === 'loading');
                if (loadingMessageIndex !== -1) {
                    newMessages[loadingMessageIndex] = { role: 'loading', content: newContent };
                }
                return newMessages;
            });
        }, 500); // Adjust the interval as needed
    };
    
    const stopLoadingMessage = () => {
        clearInterval(loadingInterval);
    
        // Remove the loading message from chat history
        setMessages(prevMessages => prevMessages.filter(m => m.role !== 'loading'));
    };

    const handlePress = (prompt) => {
        console.log(`Button pressed for: ${prompt}`);
    };

    const getBotResponse = async (messages) => {
        console.log(messages);
        try {
            const response = await axios.post(
                'https://panicpal.azurewebsites.net/api/PanicPal?code=o3_4CaEJP8c1jTBF2CUeUSlnwlj8oDwSrK6jiuG4ZPHnAzFuUUyCIg==',
                {
                    messages: messages,
                }
            );
            console.log(response.data);
            return response.data;

        } catch (error) {
            console.error('Error getting bot response: ', error);
            return {
                "role": 'assistant',
                "content": "I can't connect to Azure",
            };
        }
    };

    async function saveChatHistory(history) {
        try {
            console.log("set history to")
            console.log(JSON.stringify(history))
            await AsyncStorage.setItem('chatHistory', JSON.stringify(history));
        } catch (e) {
            console.log("Error setting chatHistory")
        }
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingBottom: keyboardHeight + 100 }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={120}
        >
            <FlatList
                ref={flatListRef}
                data={chatHistory}
                extraData={chatHistory}
                keyExtractor={(item, index) => index.toString()}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                contentContainerStyle={{ paddingBottom: inputAreaHeight }}
                renderItem={({ item }) => {
                    // Check if the message role is 'user' and apply the userMessage style
                    if (item.role === 'user') {
                        return (
                            <View style={styles.messageContainer}>
                                <View style={[styles.userMessage, { marginLeft: 'auto' }]}>
                                    <Text>{item.content}</Text>
                                </View>
                            </View>
                        );
                        // Otherwise, assume it's an 'assistant' message and apply the assistantMessage style
                    } else if (item.role === 'assistant') {
                        return (
                            <View style={styles.messageContainer}>
                                <View style={styles.assistantMessage}>
                                    <Text>{item.content}</Text>
                                </View>
                            </View>
                        );
                    } else if (item.role === 'loading') {
                        return (
                            <View style={styles.messageContainer}>
                                <View style={styles.assistantMessage}>
                                    <Text>{item.content}</Text>
                                </View>
                            </View>
                        );
                    } else {
                        // Don't render system messages
                        return null;
                    }
                }}
            />
            {chatHistory && (
                <View style={styles.promptContainer}>
                    <TouchableOpacity 
                        style={styles.promptBtn} 
                        onPress={() => { sendPrompt( interventionPrompt[0] ) }}
                    >
                        <Text>{ interventionPrompt[0] }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.promptBtn} 
                        onPress={() => { sendPrompt( interventionPrompt[1] ) }}
                    >
                        <Text>{ interventionPrompt[1] }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.promptBtn} 
                        onPress={() => { sendPrompt( interventionPrompt[2] ) }}
                    >
                        <Text>{ interventionPrompt[2] }</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.inputAreaContainer}
                onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    setInputAreaHeight(height);
                }}
            >
            <TextInput
                style={styles.input}
                value={userInput}
                onChangeText={setCurrentInput}
                placeholder="Type your message here..."
                placeholderTextColor='#000'
                underlineColorAndroid='#000'
            />
            <Button disabled={userInput.trim()===""}  title='Send' onPress={handleSend} />
            </View>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        width: '100%',
    },
    inputAreaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '100%',
    },
    promptContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        backgroundColor: 'lightgrey',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    messageContainer: {
        flexDirection: 'row',
        width: '100%',
        // paddingBottom: keyboardHeight + 100,
    },
    userMessage: {
        padding: 10,
        backgroundColor: colors.userMessage,
        borderRadius: 10,
        marginBottom: 5,
        maxWidth: '80%', 
    },
    assistantMessage: {
        padding: 10,
        backgroundColor: colors.assistantMessage,
        borderRadius: 10,
        marginBottom: 5,
        maxWidth: '80%',
    },
    promptBtn: {
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.defaultButtonColor,
        padding: 15
    },
});

export default Chat;
