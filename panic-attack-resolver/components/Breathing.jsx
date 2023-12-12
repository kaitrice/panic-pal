import {
    Animated,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    useColorScheme
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-native-a11y-slider";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../values/colors'

const secondsPause = 1;
const startTime = 2;
const defaultBreatheInTime = 6;
const defaultBreatheOutTime = 6;

const CenteredButton = ({ title, onPress, disabled, circle, color, seconds, size, isActive }) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[
            styles.button,
            circle ? styles.circle : styles.squoval,
            { backgroundColor: color },
            {
                transform: [{
                    scale: size
                }]
            }
        ]}
    >
    {isActive && (
        <Text style={styles.buttonText}>{seconds}</Text>
    )}
    </TouchableOpacity>
)

const Breathing = () => {
    const [isActive, setIsActive] = useState(false);
    const [state, setState] = useState(0);
    const [seconds, setSeconds] = useState(startTime);
    const [text, setText] = useState("Press to start!");
    const [breatheInTime, setBreatheInTime] = useState(defaultBreatheInTime);
    const [breatheOutTime, setBreatheOutTime] = useState(defaultBreatheOutTime);

    const [isBreatheInLoading, setIsBreatheInLoading] = useState(true);
    const [isBreatheOutLoading, setIsBreatheOutLoading] = useState(true);

    const states = [
        ["Breathe in", breatheInTime],
        ["Hold", secondsPause],
        ["Breathe out", breatheOutTime],
        ["Hold", secondsPause],
    ]

    const length = Object.keys(states).length;
    const height = useRef(new Animated.Value(1)).current;
    const size = useRef(new Animated.Value(1)).current;

    const theme = useColorScheme();

    const growAnimation = () => {
        Animated.timing(size, {
            toValue: 1.3,
            duration: breatheInTime * 1000,
            useNativeDriver: true,
        }).start();
    }
    const shrinkAnimation = () => {
        Animated.timing(size, {
            toValue: 1,
            duration: breatheOutTime * 1000,
            useNativeDriver: true,
        }).start();
    }
    const quickShrinkAnimation = () => {
        Animated.timing(size, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }

    async function setBreatheInAsync(value) {
        try {
            //console.log("Set volume to ", value)
            setBreatheInTime(value);
            await AsyncStorage.setItem('breatheIn', value.toString());
        } catch (e) {
            console.log("Error setting breatheIn")
        }
    }

    async function setBreatheOutAsync(value) {
        try {
            //console.log("Set volume to ", value)
            setBreatheOutTime(value);
            await AsyncStorage.setItem('breatheOut', value.toString());
        } catch (e) {
            console.log("Error setting breatheOut")
        }
    }

    useEffect(() => {
        AsyncStorage.getItem('breatheIn').then((value) => {
            if (value !== null) {
                setBreatheInTime(parseInt(value))
                setIsBreatheInLoading(false)
            }
            else {
                console.log("set default breathe in")
                setBreatheInAsync(defaultBreatheInTime);
                setIsBreatheInLoading(false);
            }
        });
        AsyncStorage.getItem('breatheOut').then((value) => {
            if (value !== null) {
                setBreatheOutTime(parseInt(value))
                setIsBreatheOutLoading(false)
            }
            else {
                console.log("set default breathe out")
                setBreatheOutAsync(defaultBreatheOutTime);
                setIsBreatheOutLoading(false);
            }
        });
    })

    useEffect(() => {
        Animated.timing(height, {
            toValue: isActive ? 0 : 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [isActive]);

    useEffect(() => {
        // This portion uses a timer that ticks every second to alternate between breathing states
        let timer = null;
        if (isActive) {
            timer = setInterval(() => {
                setSeconds((seconds) => seconds - 1);
                if (seconds == 0) {
                    setState((state + 1 % length + length) % length);
                    setText(states[state][0]);
                    setSeconds(states[state][1])
                    if (states[state][0] === "Breathe in") {
                        growAnimation();
                    }
                    else if (states[state][0] === "Breathe out") {
                        shrinkAnimation();
                    }
                }
            }, 1000);
        }
        return () => {
            clearInterval(timer);
        };
    });

    if (isBreatheInLoading || isBreatheOutLoading) {
        //console.log("loading")
        return <View><Text>Loading...</Text></View>;
    }

    const mainButton = () => {
        if(!isActive){
            setIsActive(true);
        }
        else {
            setIsActive(false);
            quickShrinkAnimation();
            setSeconds(startTime);
            setText("Press to start!");
            setState(0);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, { textAlign: 'center' }]}>{text}</Text>
            <Animated.View style={{ alignItems: "center" }}>
                <CenteredButton
                    title="Hi"
                    onPress={mainButton} circle
                    color={theme == 'light' ? styles.lightTheme : styles.darkTheme}
                    seconds={seconds}
                    size={size}
                    isActive={isActive}
                />
            </Animated.View>
            <Animated.View
                style={[
                    {
                        //backgroundColor: 'lightgrey',
                        justifyContent: 'center',
                        opacity: height
                    },
                ]

                } pointerEvents={isActive ? 'none' : 'auto'}>
                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: 'row'
                }}>
                    <Text style={theme == 'light' ? styles.lightTheme : styles.darkTheme}>inhale </Text>
                    <Slider style={{ width: "55%" }}
                        markerColor={theme == 'light' ? "#333333" : "white"}
                        labelStyle={theme == 'light' ? {
                            
                        } : {
                            backgroundColor: colors.darkBackgroundColor,
                            //borderColor: "red"
                        }}
                        labelTextStyle={theme == 'light' ? {
                            
                        } : {
                            color: "white"
                        }}
                        selectedTrackStyle={theme == 'light' ? {
                            
                        } : {
                            borderColor: "gray"
                        }}
                        trackStyle={theme == 'light' ? {
                            
                        } : {
                            borderColor: "#333333"
                        }}
                        min={1} max={15}
                        values={[breatheInTime]}
                        onChange={(values) => {
                            setBreatheInAsync(values[0]);
                        }}
                    />
                </View>
                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: 'row'
                }}>
                    <Text style={theme == 'light' ? styles.lightTheme : styles.darkTheme}>exhale</Text>
                    <Slider style={{ width: "55%" }}
                        markerColor={theme == 'light' ? "#333333" : "white"}
                        labelStyle={theme == 'light' ? {
                            
                        } : {
                            backgroundColor: colors.darkBackgroundColor,
                            //borderColor: "red"
                        }}
                        labelTextStyle={theme == 'light' ? {
                            
                        } : {
                            color: "white"
                        }}
                        selectedTrackStyle={theme == 'light' ? {
                            
                        } : {
                            borderColor: "gray"
                        }}
                        trackStyle={theme == 'light' ? {
                            
                        } : {
                            borderColor: "#333333"
                        }}
                        min={1} max={15}
                        values={[breatheOutTime]}
                        onChange={(values) => {
                            setBreatheOutAsync(values[0]);
                        }}
                    />
                </View>

            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 10,
        gap: 20
    },
    button: {
        borderColor: colors.defaultButtonColor,
        borderWidth: '4',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    squoval: {
        borderColor: '#332F2E',
        width: 70,
        height: 70,
        borderRadius: 20,
    },
    circle: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    buttonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.defaultButtonColor,
    },
    text: {
        justifyContent: "flex-start",
        flex: 1,
        fontWeight: 'bold',
        fontSize: 20,
        paddingLeft: 5
    },
    lightTheme: {
        // backgroundColor: colors.appBackgroundColor,
        color: colors.darkBackgroundColor,
    },
    darkTheme: {
        // backgroundColor: colors.darkBackgroundColor,
        color: colors.appBackgroundColor,
    },

})
export default Breathing