import React, { useState, useEffect, useRef } from 'react';
import {
    Animated,
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
// AsyncStorage.removeItem('chatHistory'); 

const Chat = () => {
    const systemMessage = {
        "role": 'system',
        "content": "The assistant is a cognitive behavioral therapist specializing in panic disorder with 20 years of experience. The assistant helps the user get through their panic attacks by reassuring them everything will be okay, helping them talk through catastrophic thoughts, and walking them through exercises that will deescalate the panic attack. Keep responses very concise and brief.",
    };
    const promptMessage = {
        'Reassurance': "Please give me reassurance.",
        'Breathing': "Please give me breathing techniques.",
        'Grounding': "Please give me grounding techniques."
    };
    const [interventionPrompt, setInterventionPrompt] = useState([promptMessage[0], promptMessage[1], promptMessage[2]]);
    const [prompt, setPrompt] = useState('');
    const [viewPrompt, setViewPrompt] = useState(true);
    const [userInput, setCurrentInput] = useState('');
    const [chatHistory, setMessages] = useState([systemMessage]);
    const flatListRef = useRef();
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [inputAreaHeight, setInputAreaHeight] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

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
            if (value !== null && JSON.parse(value).length > 0) {
                setInterventionPrompt(JSON.parse(value));
            } else {
                const defaultPrompts = Object.keys(promptMessage).map(key => promptMessage[key]);
                setDataAsync(defaultPrompts);
                setInterventionPrompt(defaultPrompts);
            }
        });
    }, []);

    useEffect(() => {
        if (prompt !== '') {
            handleSend();
            // setPrompt('');
        }
    }, [prompt]);

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 10000, // Animation duration in milliseconds
            useNativeDriver: true
        }).start(() => setViewPrompt(false)); // Hide the prompt after animation
    };

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
        if (viewPrompt)
            setViewPrompt(false);

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

    const handlePrompt = (index) => {
        const promptInput = interventionPrompt[index] || "Please give me intervention techniques for panic attacks.";        
        setCurrentInput(promptInput);
        setPrompt(promptInput);
        fadeOut(); // Start the fade-out animation
    };

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
            {viewPrompt && (
                <Animated.View style={[styles.promptContainer, { opacity: fadeAnim }]}>
                    {interventionPrompt.map((prompt, index) => (
                        <TouchableOpacity 
                            key={index}
                            style={styles.promptBtn}
                            onPress={() => handlePrompt(index)}
                        >
                            <Text>{prompt}</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
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
        marginTop: 20,
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
