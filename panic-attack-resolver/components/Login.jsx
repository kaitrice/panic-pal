import React, { useState} from 'react';
import {
    TouchableOpacity,
    Text,
    TextInput,
    View,
    StyleSheet,
    Alert
} from 'react-native';


import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "../values/firebaseConfig";

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

const Login = ({setCurrentScreen}) => {
    const [hasAccount, setHasAccount] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={styles.container}>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Email"
                    placeholderTextColor='#000'
                    underlineColorAndroid='#000'
                    onChangeText={(email) => setEmail(email)}
                />
            </View>

            <View style={styles.inputView}>
                <TextInput
                    secureTextEntry={true}
                    style={styles.TextInput}
                    placeholder="Password"
                    placeholderTextColor='#000'
                    underlineColorAndroid='#000'
                    onChangeText={(password) => setPassword(password)}
                />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={() => { hasAccount ? loginWithAccount(email, password, setCurrentScreen) : registerAccount(email, password) }}>
                <Text style={styles.loginText}>{hasAccount ? "Login" : "Register"}</Text>
            </TouchableOpacity>



            <TouchableOpacity style={styles.loginBtn} onPress={() => { setHasAccount(!hasAccount) }}>
                <Text style={styles.loginText}>{hasAccount ? "Don't have an account yet?" : "Already have an account?"}</Text>
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        marginBottom: 40,
    },
    inputView: {
        backgroundColor: colors.defaultButtonColor,
        borderRadius: 30,
        width: "100%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        width: "100%",
        textAlign: "center"
    },
    forgot_button: {
        height: 30,
        marginBottom: 30,
    },
    loginBtn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40,
        backgroundColor: colors.loginButtonColor,
    },
    loginText: {
        fontWeight: "bold",
        color: 'white',
        textAlign: "center",
    },
});

export default Login