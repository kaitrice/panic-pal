import Slider from "react-native-a11y-slider";
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import DragList from 'react-native-draglist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {colors} from '../values/colors'

const defaultInterventionOrder = ['Breathing', 'Grounding', 'Reassurance'];
const defaultVolume = 10;


export default function Draggable(sliderValue) {
    const [data, setData] = useState(defaultInterventionOrder);
    const [isInterventionsLoading, setisInterventionsLoading] = useState(true)
    const [isVolumeLoading, setisVolumeLoading] = useState(true)
    const [volume, setVolume] = useState(defaultVolume);
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

    if(isVolumeLoading || isInterventionsLoading){
        console.log("loading")
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
                <Text style={styles.text}>{item}</Text>
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

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Interventions</Text>
            <DragList
                data={data}
                keyExtractor={keyExtractor}
                onReordered={onReordered}
                renderItem={renderItem}
            />
            <Text style={styles.header}>Volume</Text>
            <Slider min={1} max={100}
                values={[volume]}
                onChange={(values) => {
                    setVolumeAsync(values[0])
                }} />
            {/* <>
                {data.map(info => <Text>{info}</Text>)}
            </> */}
        </View>
    );
}

const styles = StyleSheet.create({
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
        fontWeight: 'bold',
        fontSize: 20,
    },
    active: {
        backgroundColor: 'white',
    },
    scrolledList: {
        height: 200,
    },
});