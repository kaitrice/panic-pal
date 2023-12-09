import React, { useState } from 'react';
import {
    TouchableOpacity,
    Text,
    TextInput,
    View,
    StyleSheet,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


import { getAuth, sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../values/firebaseConfig";

import { colors } from '../values/colors'


const auth = getAuth();

const registerAccount = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            console.log("registered " + email)
            const user = userCredential.user.email;

            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            Alert.alert("Error Registering", errorMessage, [
                {
                    text: "OK"
                }
            ])
            console.log("error register " + errorCode + " " + errorMessage)
            // ..
        });
}

const loginWithAccount = (email, password, setCurrentScreen) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user.email;
            console.log("logged in " + user)
            setCurrentScreen("Chat")
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            Alert.alert("Error Logging In", errorMessage, [
                {
                    text: "OK"
                }
            ])
            console.log("error login " + errorCode + " " + errorMessage)
        });
}

const Login = ({ setCurrentScreen }) => {
    const [hasAccount, setHasAccount] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleForgotPassword = () => {
        // setForgotPasswordVisible(!forgotPasswordVisible);
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("Password reset email sent")
                Alert.alert("Password reset email sent to " + email, "If you don't see it, check your junk folder.", [
                    {
                        text: "OK"
                    }
                ])
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
    };

    return (

        <View style={styles.container}>
            <View style={styles.borderContainer}>


                <Text style={styles.signupLoginText}>
                    {hasAccount ? "LOGIN" : "SIGN UP"}
                </Text>
                <Text style={styles.textDetails}>
                    {"\n"}
                    Email
                </Text>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        //placeholder="Email"
                        // placeholderTextColor='#000'
                        // underlineColorAndroid='#000'
                        onChangeText={(email) => setEmail(email)}
                    />
                </View>

                <Text style={styles.textDetails}>
                    Password
                </Text>
                <View style={styles.inputView}>
                    <TextInput
                        secureTextEntry={!showPassword}
                        style={styles.TextInput}
                        // placeholder="Password"
                        // placeholderTextColor='#000'
                        // underlineColorAndroid='#000'
                        onChangeText={(password) => setPassword(password)}
                    />
                    <TouchableOpacity onPress={toggleShowPassword} style={styles.showPasswordButton}>
                        <Ionicons name={showPassword ? 'lock-closed' : 'lock-open'} size={20} color={colors.specialButtonColor} />
                    </TouchableOpacity>

                    <Text onPress={toggleForgotPassword} style={styles.forgotBtn}>{hasAccount ? "forgot password?" : " "}</Text>

                </View>

                <TouchableOpacity style={styles.loginBtn} onPress={() => { hasAccount ? loginWithAccount(email, password, setCurrentScreen) : registerAccount(email, password) }}>
                    <Text style={styles.loginText}>{hasAccount ? "Login" : "Register"}</Text>
                </TouchableOpacity>

                <View style={styles.sep}></View>

                <TouchableOpacity style={styles.userButtonContainer} onPress={() => { setHasAccount(!hasAccount) }}>
                    <Text style={styles.userButtonText}>{hasAccount ? "Need an account? SIGN UP" : "Already a User? LOGIN"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        width: 330,
    },
    borderContainer: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        padding: 40,
    },
    showPasswordButton: {
        position: 'absolute',
        right: 5,
        top: 7,
    },
    sep: {
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 40,
    },
    signupLoginText: {
        color: colors.loginButtonColor,
        fontSize: 25,
        fontWeight: "bold",
    },
    textDetails: {
        fontSize: 14,
    },
    inputView: {
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.defaultButtonColor,
        height: 40,
        marginBottom: 20,
        marginTop: 5,
    },
    TextInput: {
        padding: 10,
        width: 185,
    },
    forgotBtn: {
        height: 30,
        marginTop: 5,
        marginBottom: 30,
        textAlign: 'right',
    },
    loginBtn: {
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.loginButtonColor,
        backgroundColor: colors.loginButtonColor,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40,
        marginTop: 10,
    },
    loginText: {
        fontWeight: "bold",
        color: 'white',
        textAlign: "center",
        textTransform: "uppercase",
    },
    userButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    userButtonText: {
        color: '#00aced',
        textAlign: 'center',
    },
});

export default Login