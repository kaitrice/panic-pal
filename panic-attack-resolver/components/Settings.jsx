import Slider from "react-native-a11y-slider";
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import DragList from 'react-native-draglist';

const interventionPreferenceOrder = ['Breathing', 'Grounding', 'Reassurance'];


export default function Draggable() {
    const [data, setData] = useState(interventionPreferenceOrder);
    const [volume, setVolume] = useState(10);

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
        setData(copy);
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
                        setVolume(values[0])
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
        backgroundColor: '#80B9E2',
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
        //backgroundColor: 'yellow',
    },
    scrolledList: {
        height: 200,
    },
});