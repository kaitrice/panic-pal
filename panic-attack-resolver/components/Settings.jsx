import Slider from "react-native-a11y-slider";
import React, { useState, useEffect } from 'react';
import {
    Alert,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import DragList from 'react-native-draglist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut, getAuth, deleteUser } from "../values/firebaseConfig";

import { colors } from '../values/colors'

const defaultInterventionOrder = ['Breathing', 'Grounding', 'Reassurance'];
const defaultVolume = 10;

const auth = getAuth();

export default function Settings({setCurrentScreen}) {
    const [data, setData] = useState(defaultInterventionOrder);
    const [isInterventionsLoading, setisInterventionsLoading] = useState(true)
    const [isVolumeLoading, setisVolumeLoading] = useState(true)
    const [volume, setVolume] = useState(defaultVolume);
    const theme = useColorScheme();
    const [isEnabled, setIsEnabled] = useState(theme === 'dark');
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    //AsyncStorage.removeItem('volume'); //use this to test the default volume being put into storage correctly
    //AsyncStorage.removeItem('interventions'); //use this to test the default interventions being put into storage correctly
    useEffect(() => {
        AsyncStorage.getItem('interventions').then((value) => {
            if (value !== null) {
                setData(JSON.parse(value))
                setisInterventionsLoading(false)
            }
            else {
                console.log("set default interventions order")
                setDataAsync(defaultInterventionOrder);
                setisInterventionsLoading(false);
            }
        });
        AsyncStorage.getItem('volume').then((value) => {
            if (value !== null) {
                setVolume(parseInt(value))
                setisVolumeLoading(false)
            }
            else {
                console.log("set default volume")
                setVolumeAsync(defaultVolume);
                setisVolumeLoading(false);
            }
        });
    }, [])

    useEffect(() => {
        setIsEnabled(theme === 'dark');
    }, [theme]);

    if (isVolumeLoading || isInterventionsLoading) {
        //console.log("loading")
        return <View><Text>Loading...</Text></View>;
    }
    //console.log(volume)
    function keyExtractor(str) {
        return str;
    }

    function renderItem(info) {

        const { item, onDragStart, onDragEnd, isActive } = info;
        return (
            <TouchableOpacity
                key={item}
                style={[styles.item, isActive && styles.active]}
                onPressIn={onDragStart}
                onPressOut={onDragEnd}>
                <View style={styles.rowContainer}>
                    <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.text]}>{item}</Text>
                    <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.index]}>{data.indexOf(item) + 1}</Text>
                </View>

            </TouchableOpacity>
        );
    }

    async function onReordered(fromIndex, toIndex) {
        const copy = [...data]; // Don't modify react data in-place
        const removed = copy.splice(fromIndex, 1);

        copy.splice(toIndex, 0, removed[0]); // Now insert at the new pos
        setDataAsync(copy);
    }

    async function setVolumeAsync(value) {
        try {
            //console.log("Set volume to ", value)
            setVolume(value);
            await AsyncStorage.setItem('volume', value.toString());
        } catch (e) {
            console.log("Error setting volume")
        }
    }

    async function setDataAsync(value) {
        try {
            //console.log("Set volume to ", value)
            setData(value);
            await AsyncStorage.setItem('interventions', JSON.stringify(value));
        } catch (e) {
            console.log("Error setting interventions")
        }
    }

    const deleteAccount = () => {
        Alert.alert(
            "Do you want to delete this account?",
            "You cannot undo this action.",
            [
                {
                    text: "Cancel",
                },
                {
                    text: "Delete",
                    onPress: () => {
                        const user = auth.currentUser;
                        deleteUser(user).then(() => {
                            console.log("User deleted")
                        }).catch((error) => {
                            console.log("Error deleting user " + error)
                        });
                        setCurrentScreen('Login');
                    },
                    style: 'destructive'
                },
            ]
        );

    }

    const signOutUser = () => {
        Alert.alert(
            "Do you want to log out?",
            "You can always log back in.",
            [
                {
                    text: "Cancel",
                },
                {
                    text: "Sign out",
                    onPress: () => {
                        const auth = getAuth();
                        signOut(auth).then(() => {
                            console.log("User logged out")
                        }).catch((error) => {
                            console.log(error);
                        })
                        setCurrentScreen('Login');
                    },
                },
            ]
        );

    }

    return (
        <View style={styles.container}>
            <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.header]}>Interventions</Text>
            <DragList
                data={data}
                keyExtractor={keyExtractor}
                onReordered={onReordered}
                renderItem={renderItem}
            />
            {/* <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.header]}>Volume</Text>
            <Slider min={1} max={100}
                values={[volume]}
                onChange={(values) => {
                    setVolumeAsync(values[0])
                }} /> */}
            {/* <>
                {data.map(info => <Text>{info}</Text>)}
            </> */}
            <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.header]}>Dark Mode</Text>
            <Switch
                trackColor={{ false: '#767577', true: colors.defaultButtonColor }}
                thumbColor={isEnabled ? colors.loginButtonColor : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
            <View style={styles.btnContainer}>
                <TouchableOpacity style={[styles.signOutBtn, styles.btn]} onPress={() => { signOutUser() }}>
                    <Text style={styles.btnTxt}>Sign out</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.deleteBtn, styles.btn]} onPress={() => { deleteAccount() }}>
                    <Text style={styles.btnTxt}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    container: {
        marginTop: 10,
        padding: 10,
        flex: 1,
    },
    header: {
        fontSize: 20,
        marginTop: 16,
        marginBottom: 8,
    },
    item: {
        backgroundColor: colors.defaultButtonColor,
        borderWidth: 1,
        borderColor: 'black',
        minHeight: 40,
        minWidth: 250,
    },
    text: {
        justifyContent: "flex-start",
        flex: 1,
        fontWeight: 'bold',
        fontSize: 20,
        paddingLeft: 5
    },
    index: {
        textAlign: "right",
        justifyContent: "flex-end",
        flex: 0.5,
        fontWeight: 'bold',
        fontSize: 20,
        paddingRight: 10
    },
    active: {
        backgroundColor: 'white',
    },
    scrolledList: {
        height: 200,
    },
    lightTheme: {
        backgroundColor: colors.appBackgroundColor,
        color: colors.darkBackgroundColor,
    },
    darkTheme: {
        backgroundColor: colors.darkBackgroundColor,
        color: colors.appBackgroundColor,
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 40
    },
    btn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    deleteBtn: {
        backgroundColor: colors.sosButtonColor,
    },
    signOutBtn: {
        backgroundColor: colors.defaultButtonColor,
        marginBottom: 20,
    },
    btnTxt: {
        color: 'white',
        fontWeight: 'bold',
    },
});