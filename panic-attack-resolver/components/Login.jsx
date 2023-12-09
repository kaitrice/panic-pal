import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StyleSheet,
  Alert,
  Image,
  useColorScheme,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';


import {
  getAuth,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '../values/firebaseConfig';

import {colors} from '../values/colors';

const auth = getAuth ();

const registerAccount = (email, password) => {
  createUserWithEmailAndPassword (auth, email, password)
    .then (userCredential => {
      // Signed up
      console.log ('registered ' + email);
      const user = userCredential.user.email;

      // ...
    })
    .catch (error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert ('Error Registering', errorMessage, [
        {
          text: 'OK',
        },
      ]);
      console.log ('error register ' + errorCode + ' ' + errorMessage);
      // ..
    });
};

const loginWithAccount = (email, password, setCurrentScreen) => {
  signInWithEmailAndPassword (auth, email, password)
    .then (userCredential => {
      // Signed in
      const user = userCredential.user.email;
      console.log ('logged in ' + user);
      setCurrentScreen ('Chat');
      // ...
    })
    .catch (error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert ('Error Logging In', errorMessage, [
        {
          text: 'OK',
        },
      ]);
      console.log ('error login ' + errorCode + ' ' + errorMessage);
    });
};

const Login = ({setCurrentScreen}) => {
  const [hasAccount, setHasAccount] = useState (true);
  const [email, setEmail] = useState ('');
  const [password, setPassword] = useState ('');
  const [showPassword, setShowPassword] = useState (false);
  const theme = useColorScheme();

  const toggleShowPassword = () => {
    setShowPassword (!showPassword);
  };

  const toggleForgotPassword = () => {
    sendPasswordResetEmail (auth, email)
      .then (() => {
        console.log ('Password reset email sent');
        Alert.alert (
          'Password reset email sent to ' + email,
          "If you don't see it, check your junk folder.",
          [
            {
              text: 'OK',
            },
          ]
        );
      })
      .catch (error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <View style={styles.container}>
      <View style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.borderContainer]}>
        
        <Text style={[styles.signupLoginText, theme == 'light' ? styles.signupLoginTextLight : styles.signupLoginTextDark]}>
          {hasAccount ? 'LOGIN' : 'SIGN UP'}
        </Text>
        <Text style={[theme == "light" ? styles.lightTheme : styles.darkTheme]}>
          {'\n'}
          Email
        </Text>
        <View style={styles.inputView}>
          <TextInput
            style={[styles.textInput, theme == "light" ? styles.lightTheme : styles.darkTheme]}
            // placeholder="Email"
            // placeholderTextColor='#000'
            // underlineColorAndroid='#000'
            onChangeText={email => setEmail (email)}/>
        </View>

        <Text style={[theme == "light" ? styles.lightTheme : styles.darkTheme,]}>
          Password
        </Text>
        <View style={styles.inputView}>
          <TextInput
            secureTextEntry={!showPassword}
            style={[styles.textInput, theme == "light" ? styles.lightTheme : styles.darkTheme]}
            // placeholder="Password"
            // placeholderTextColor='#000'
            // underlineColorAndroid='#000'
            onChangeText={password => setPassword (password)}/>

          <TouchableOpacity onPress={toggleShowPassword} style={styles.showPasswordBtn}>
            <Ionicons name={showPassword ? 'ios-eye-off' : 'ios-eye'} size={20} color={colors.specialButtonColor}/>
          </TouchableOpacity>

          {hasAccount &&
            <TouchableOpacity onPress={toggleForgotPassword} style={styles.forgotBtnContainer}>
              <Text style={[styles.forgotBtn, theme == "light" ? styles.lightTheme : styles.darkTheme]}>
              
              
              forgot password?</Text>
            </TouchableOpacity>}
        </View>

        <TouchableOpacity style={[styles.loginBtnContainer, theme == "light" ? styles.loginBtnContainerLight : styles.loginBtnContainerDark]}  onPress={() => {hasAccount ? loginWithAccount (email, password, setCurrentScreen) : registerAccount (email, password);}}>
          <Text style={[styles.loginBtnText, theme == "light" ? styles.loginBtnTextLight : styles.loginBtnTextDark]}>
            {hasAccount ? 'Login' : 'Register'}
          </Text>
        </TouchableOpacity>

        <View style={styles.sep}/>

        <TouchableOpacity style={styles.userBtnContainer} onPress={() => { setHasAccount (!hasAccount);}}>
          <Text style={styles.userBtnText}>
            {hasAccount ? 'Need an account? SIGN UP' : 'Already a User? LOGIN'}
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.slothContainer}>
        <Image source={require ('../assets/sloths/sloth-tree-closed_eyes.png')} style={styles.sloth} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    width: 330,
    marginBottom: 100,
  },
  borderContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 40,
  },
  sep: {
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputView: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.defaultButtonColor,
    height: 40,
    marginBottom: 20,
    marginTop: 5,
  },
  textInput: {
    padding: 10,
    width: 185,
  },
  signupLoginText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  forgotBtnContainer: {
    marginLeft: 101,
    marginTop: 10,
    width: 104,
  },
  forgotBtn: {
    textAlign: 'right',
    fontSize: 13,
  },
  showPasswordBtn: {
    position: 'absolute',
    right: 5,
    top: 7,
  },
  loginBtnContainer: {
    borderRadius: 4,
    borderWidth: 2,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    marginTop: 12,
  },
  loginBtnText: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  userBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  userBtnText: {
    color: '#00aced',
    textAlign: 'center',
  },
  slothContainer: {
    position: 'absolute',
    bottom: -80,
    right: -90,
  },
  sloth: {
    width: 350,
    height: 150,
  },

  lightTheme: {
    backgroundColor: 'white',
  },
  loginBtnContainerLight: {
    borderColor: colors.loginButtonColor,
    backgroundColor: colors.loginButtonColor,
  },
  loginBtnTextLight: {
    backgroundColor: colors.loginButtonColor,
  },
  signupLoginTextLight: {
    color: colors.loginButtonColor,
  },
  
  darkTheme: {
    backgroundColor: '#212020',
    color: colors.appBackgroundColor,
  },
  loginBtnContainerDark: {
    borderColor: colors.darkLoginButtonColor,
    backgroundColor: colors.darkLoginButtonColor,
  },
  loginBtnTextDark: {
    backgroundColor: colors.darkLoginButtonColor,
  },
  signupLoginTextDark: {
    color: colors.darkLoginButtonColor,
  },
});

export default Login;
