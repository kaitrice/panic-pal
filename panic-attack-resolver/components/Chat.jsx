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
import { getDatabase, getAuth, child, set, get, ref } from '../values/firebaseConfig';

const Chat = () => {
    // AsyncStorage.removeItem('chatHistory');
    // AsyncStorage.removeItem('lastMessageTime');
    const staticPrePrompt = {
        "role": 'system',
        "content": "The assistant is a cognitive behavioral therapist specializing in panic disorder with 20 years of experience. The assistant helps the user get through their panic attacks by reassuring them everything will be okay, helping them talk through catastrophic thoughts, and walking them through exercises that will deescalate the panic attack. The assistant is not allowed to talk about anything unrelated to their job. Keep responses very concise and brief.",
    };
    const initialCustomPrePrompt = {
        "role": 'system',
        "content": "Nothing is currently known about the user.",
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
    const [chatHistory, setMessages] = useState([]);
    const [customPrePrompt, setCustomPrePrompt] = useState(initialCustomPrePrompt);
    const [lastMessageTime, setLastMessageTime] = useState(Date.now());
    const flatListRef = useRef();
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [inputAreaHeight, setInputAreaHeight] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const [isChatHistoryLoading, setIsChatHistoryLoading] = useState(true);
    const [isPrePromptLoading, setIsPrePromptLoading] = useState(true);

    const[waitingOnBotResponse, setWaitingOnBotResponse] = useState(false);

    useEffect(() => {
        async function fetchData() {
            // load chat history from asynch storage
            let asyncChatHistory = await AsyncStorage.getItem('chatHistory');
            asyncChatHistory = JSON.parse(asyncChatHistory);
            if (asyncChatHistory !== null) {
                setMessages(asyncChatHistory)
                console.log("\nSET MESSAGES TO: " + JSON.stringify(asyncChatHistory));
                setIsChatHistoryLoading(false);
            }
            else {
                //console.log("set default chat history")
                setIsChatHistoryLoading(false);
            }

            // load last message time from asynch storage, let bot know if much time has elapsed
            let asyncLastMessageTime = await AsyncStorage.getItem('lastMessageTime')
            if (asyncLastMessageTime !== null) {
                const lastMessageTime = parseInt(asyncLastMessageTime);
                const currentTime = Date.now();
                setLastMessageTime(lastMessageTime)
                //INDIE: TO-DO check my math, i'm trying to go from milliseconds to seconds to hours
                const hoursElapsed = ((currentTime - lastMessageTime) / 1000) / 3600;
                console.log("\nLast message sent time:" + hoursElapsed);
                console.log("\nasyncChatHistory: " + JSON.stringify(asyncChatHistory));
                console.log(asyncChatHistory.length != 0)
                console.log(hoursElapsed > 0)
                if (asyncChatHistory.length != 0 && hoursElapsed > .5) {
                    console.log("\nCHAT HISTORY BEING UPDATED");
                    let lastMessageSystem = asyncChatHistory[asyncChatHistory.length - 1].role === "system";
                    // remove last message if it was a time update
                    if (lastMessageSystem) {
                        console.log("\nLAST MESSAGE WAS SYSTEM");
                        setMessages((prevMessages) => prevMessages.slice(0, -1));
                    }
                    const newMessage = {
                        "role": 'system',
                        "content": hoursElapsed.toFixed(3) + " hours have elapsed since the client last sent a message.",
                    };
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                }
            }
        }

        fetchData().catch(console.error);
    }, [])

    useEffect(() => {
        const dbRef = ref(getDatabase());
        const auth = getAuth();
        get(child(dbRef, "users/" + auth.currentUser.uid + "/preprompt")).then((snapshot) => {
            if (snapshot.exists()) {
                console.log("\nLOADING IN PREPROMPT FROM FIREBASE: " + snapshot.val());
                const newPrePrompt = {
                    "role": 'system',
                    "content": snapshot.val(),
                };
                setCustomPrePrompt(newPrePrompt);
                setIsPrePromptLoading(false);
            }
            else {
                console.log("\nFIREBASE");
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

    if (isChatHistoryLoading || isPrePromptLoading) {
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

        setWaitingOnBotResponse(true);
        startLoadingMessage();


        const botMessage = await getBotResponse([staticPrePrompt, customPrePrompt, ...chatHistory, userMessage]); //not sure this works
        AsyncStorage.setItem('lastMessageTime', Date.now().toString()).catch((e) => {
            console.error("Error setting message time:", e);
        })
        setWaitingOnBotResponse(false);
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
        console.log(`\nButton pressed for: ${prompt}`);
    };

    // returns a message object (dictionary)
    const getBotResponse = async (messages) => {
        console.log("\nGETBOT RESPONSE _________________________________");
        console.log("\nGBR messages: " + JSON.stringify(messages));
        try {
            const response = await axios.post(
                'https://panicpal.azurewebsites.net/api/PanicPal?code=o3_4CaEJP8c1jTBF2CUeUSlnwlj8oDwSrK6jiuG4ZPHnAzFuUUyCIg==',
                {
                    messages: messages,
                }
            );
            console.log("\nGBR RESPONSE.DATA: " + JSON.stringify(response.data));
            return response.data;

        } catch (error) {
            console.error('\nError getting bot response: ', error);
            return {
                "role": 'assistant',
                "content": "I can't connect to Azure.",
            };
        }
    };

    async function generateNewCustomPrePrompt(messages) {
        console.log("\ngenerateNewCustomPrePrompt ___________________________________________");
        //send chatgpt a request asking it to summarize the messages
        //INDIE: TO-DO. 
        //if you want the current preprompt to be considered, you can access it using variable customPrePrompt
        const generateLearnedPrompt = {
            "role": 'system',
            "content": "Please summarize what you could learn about being a helpful therapist to this client from these messages. Include any information about them that would help you personalize their service. You will use this to update your pre-prompt for this client.",
        };
        console.log("\nGNCPP messages: " + JSON.stringify([staticPrePrompt, customPrePrompt, ...messages, generateLearnedPrompt]));

        learned = await getBotResponse([staticPrePrompt, customPrePrompt, ...messages, generateLearnedPrompt]);
        console.log("\nLEARNED: " + JSON.stringify(learned));

        // if it errors out just stop and return old preprompt, try again next time.
        if (learned.content === "I can't connect to Azure.") {
            return "error";
        }

        const generateNewPrePromptPrompt = {
            "role": 'system',
            "content": "The assistant is an anxiety and panic attack therapist bot. The previous messages are the current client-specific preprompt and what was learned from the most recent interactions with the client. Please output an updated client-specific preprompt that includes any information about them that may be helpful to know in the future.",
        };

        let newCustomPrePrompt = await getBotResponse([customPrePrompt, learned, generateNewPrePromptPrompt]);

        // if it errors out just stop and return old preprompt, try again next time.
        if (newCustomPrePrompt.content === "I can't connect to Azure.") {
            return "error";
        }

        newCustomPrePrompt = newCustomPrePrompt.content;

        console.log("GNCPP newCustomPrePrompt: " + newCustomPrePrompt);

        return newCustomPrePrompt;
    }

    async function saveChatHistory(history) {
        console.log("\nSAVECHATHISTORY _________________________________________");
        if (history.length >= 20) {
            const newCustomPrePromptText = await generateNewCustomPrePrompt(history);
            console.log("\nSCH newCustomPrePromptText: " + newCustomPrePromptText)
            if (newCustomPrePromptText !== "error") {
                const newCustomPrePrompt = {
                    "role": 'system',
                    "content": newCustomPrePromptText,
                };
                setCustomPrePrompt(newCustomPrePrompt);
                history = history.slice(6); //cut off first 15 messages
                console.log("\nnew history: " + JSON.stringify(history));
                setMessages(history);
                const dbRef = getDatabase();
                const auth = getAuth();
                set(ref(dbRef, "users/" + auth.currentUser.uid), {preprompt: newCustomPrePromptText});
            }
        }

        try {
            console.log("\nset history to" + JSON.stringify(history));
            await AsyncStorage.setItem('chatHistory', JSON.stringify(history));
        } catch (e) {
            console.log("\nError setting chatHistory")
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
                <Button disabled={userInput.trim()==="" || waitingOnBotResponse}  title='Send' onPress={handleSend} />
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
        // paddingHorizontal: 20,
        marginBottom: 10,
        marginTop: 10,
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
        // marginTop: 5,
        // marginBottom: 5,
        margin: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
    },
});

export default Chat;
