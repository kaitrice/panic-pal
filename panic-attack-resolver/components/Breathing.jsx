import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import React, { useState, useEffect } from 'react';
import {colors} from '../values/colors'

const secondsPause = 2;
const startTime = 2;
const defaultBreatheInTime = 6;
const defaultBreatheOutTime = 6;
const states = [
    ["Breathe in", defaultBreatheInTime],
    ["Relax", secondsPause],
    ["Breathe out", defaultBreatheOutTime],
    ["Relax", secondsPause],
]

const CenteredButton = ({ title, onPress, disabled, circle, color, seconds }) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[
            styles.button,
            circle ? styles.circle : styles.squoval,
            { backgroundColor: color },
        ]}
    >
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
)


const Breathing = () => {
    const [isActive, setIsActive] = useState(false);
    const [state, setState] = useState(0);
    const [seconds, setSeconds] = useState(startTime);
    const [text, setText] = useState("Press to start!");
    const length = Object.keys(states).length;
    useEffect(() => {
        let timer = null;
        if (isActive) {
            timer = setInterval(() => {
                setSeconds((seconds) => seconds - 1);
                if(seconds == 0) {
                    setState((state+1 % length + length) % length);
                    console.log(state)
                    setText(states[state][0]);
                    setSeconds(states[state][1]) 
                }
            }, 1000);
        }
        return () => {
            clearInterval(timer);
        };
    });
    return (
        <View style={styles.container}>
            <Text>{text} {seconds}</Text>
            <CenteredButton title="Hi" onPress={() => { setIsActive(!isActive); }} circle color={colors.appBackgroundColor} seconds={seconds}></CenteredButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        // backgroundColor: 'white',
        justifyContent: 'center',
        padding: 10,
        gap: 20
    },
    button: {
        borderColor: colors.defaultButtonColor,
        borderWidth: '4',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
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
})
export default Breathing