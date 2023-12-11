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
import { getDatabase, getAuth, child, set, get, ref } from '../values/firebaseConfig';

const Chat = () => {
    //AsyncStorage.removeItem('chatHistory');
    const staticPrePrompt = {
        "role": 'system',
        "content": "The assistant is a cognitive behavioral therapist specializing in panic disorder with 20 years of experience. The assistant helps the user get through their panic attacks by reassuring them everything will be okay, helping them talk through catastrophic thoughts, and walking them through exercises that will deescalate the panic attack. Keep responses very concise and brief.",
    };
    const initialCustomPrePrompt = {
        "role": 'system',
        "content": "Nothing is currently known about the user.",
    };
    const [interventionPrompt, setInterventionPrompt] = useState('');
    const [userInput, setCurrentInput] = useState('');
    const [chatHistory, setMessages] = useState([]);
    const [customPrePrompt, setCustomPrePrompt] = useState(initialCustomPrePrompt); // preprompt
    const [lastMessageTime, setLastMessageTime] = useState(Date.now());
    const flatListRef = useRef();
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [inputAreaHeight, setInputAreaHeight] = useState(0);

    const [isChatHistoryLoading, setIsChatHistoryLoading] = useState(true);
    const [isPrePromptLoading, setIsPrePromptLoading] = useState(true);

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
        AsyncStorage.getItem('lastMessageTime').then((value) => {
            if (value !== null) {
                const lastMessageTime = parseInt(value);
                const currentTime = Date.now();
                setLastMessageTime(lastMessageTime)
                //INDIE: TO-DO check my math, i'm trying to go from milliseconds to seconds to hours
                const hoursElapsed = ((currentTime - lastMessageTime) / 1000) / 3600;
                console.log(hoursElapsed);
                if (hoursElapsed > 1) {
                    let lastMessageSystem = chatHistory[chatHistory.length - 1].role === "system";
                    if (lastMessageSystem) {
                        chatHistory[chatHistory.length - 1].content === hoursElapsed + " hours have elapsed."
                    }
                    else {
                        const newMessage = {
                            "role": 'system',
                            "content": hoursElapsed + " hours have elapsed.",
                        };
                        setMessages((prevMessages) => [...prevMessages, newMessage]);
                    }
                }
            }
        });
    }, [])

    useEffect(() => {
        const dbRef = ref(getDatabase());
        const auth = getAuth();
        get(child(dbRef, "users/" + auth.currentUser.uid + "/preprompt")).then((snapshot) => {
            if (snapshot.exists()) {
                console.log("snapshot exists");
                console.log(snapshot.key + snapshot.val())
                const newPrePrompt = {
                    "role": 'system',
                    "content": snapshot.val(),
                };
                setCustomPrePrompt(newPrePrompt);
                setIsPrePromptLoading(false);
            }
            else {
                console.log("no data");
                setIsPrePromptLoading(false);
            }
        }).catch((error) => {
            console.error(error);
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

    if (isChatHistoryLoading || isPrePromptLoading) {
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


        const botMessage = await getBotResponse([staticPrePrompt, customPrePrompt, ...chatHistory, userMessage]); //not sure this works
        AsyncStorage.setItem('lastMessageTime', Date.now().toString()).catch((e) => {
            console.error("Error setting message time:", e);
        })
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

    async function generateNewCustomPrePrompt(fifteenMessages) {
        //send chatgpt a request asking it to summarize the messages
        //INDIE: TO-DO. 
        //if you want the current preprompt to be considered, you can access it using variable customPrePrompt
        const generateLearnedPrompt = {
            "role": 'system',
            "content": "Please summarize what you could learn about being a helpful therapist to this client from these messages. You will use this to update your pre-prompt for this client.",
        };
        try {
            const response = await axios.post(
                'https://panicpal.azurewebsites.net/api/PanicPal?code=o3_4CaEJP8c1jTBF2CUeUSlnwlj8oDwSrK6jiuG4ZPHnAzFuUUyCIg==',
                {
                    messages: [staticPrePrompt, customPrePrompt, ...fifteenMessages, generateLearnedPrompt],
                }
            );
            //parse out the bot response (response.data[response.data.length - 1].content)?
            console.log("learned: " + response.data[response.data.length - 1].content);

            learned = response.data[response.data.length - 1].content;

            const learnedMessage = {
                "role": 'system',
                "content": learned,
            };
            // have chatgpt create new preprompt from current context and what it learned
            const generateNewPrePromptPrompt = {
                "role": 'system',
                "content": "You are a therapist bot helping clients with panic attacks. The previous messages are the current client-specific preprompt and what you learned from the most recent interactions with your client. Please generate a new preprompt for yourself based on the previous client-specific preprompt and anything significant that you learned about the client. Keep the preprompt under 500 words.",
            };

            const response2 = await axios.post(
                'https://panicpal.azurewebsites.net/api/PanicPal?code=o3_4CaEJP8c1jTBF2CUeUSlnwlj8oDwSrK6jiuG4ZPHnAzFuUUyCIg==',
                {
                    messages: [customPrePrompt, learnedMessage, generateNewPrePromptPrompt],
                }
            );

            console.log("newPrePrompt: " + response2.data[response.data.length - 1].content);

            newCustomPrePrompt = response2.data[response.data.length - 1].content;

            return newCustomPrePrompt;

        } catch (error) {
            console.error('Error getting bot response: ', error);
            return "error"
        }
        //parse out the bot response (response.data[response.data.length - 1].content)?
        //return the summary
    }

    async function saveChatHistory(history) {
        if (history.length >= 30) {
            const firstFifteenMessages = history.slice(0, 15); //get first 15 messages
            const newCustomPrePromptText = generateNewCustomPrePrompt(firstFifteenMessages);
            if (summary !== "error") {
                const newCustomPrePrompt = {
                    "role": 'system',
                    "content": newCustomPrePromptText,
                };
                setCustomPrePrompt(newCustomPrePrompt);
                history = history.slice(15); //cut off first 15 messages
                setMessages(history);
                const dbRef = getDatabase();
                const auth = getAuth();
                set(ref(dbRef, "users/" + auth.currentUser.uid + "/preprompt"), newPrePrompt);
            }
        }

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
                        onPress={() => { sendPrompt(interventionPrompt[0]) }}
                    >
                        <Text>{interventionPrompt[0]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.promptBtn}
                        onPress={() => { sendPrompt(interventionPrompt[1]) }}
                    >
                        <Text>{interventionPrompt[1]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.promptBtn}
                        onPress={() => { sendPrompt(interventionPrompt[2]) }}
                    >
                        <Text>{interventionPrompt[2]}</Text>
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
                <Button disabled={userInput.trim() === ""} title='Send' onPress={handleSend} />
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
