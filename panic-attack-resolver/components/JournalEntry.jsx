import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../values/colors'

const JournalEntry = () => {
    const [journalText, setJournalText] = useState('');
    const [journalEntries, setJournalEntries] = useState([]);

    const handleChange = (text) => {
      setJournalText(text);
    }
  
    const handleSave = async () => {
      try {
        const newEntry = { id: Date.now().toString(), text: journalText };
        journalEntries.push(newEntry);
        await AsyncStorage.setItem('journalEntries', JSON.stringify([...journalEntries, newEntry]));
        setJournalText('');
        console.log(JSON.stringify(journalEntries));
      } catch (error) {
        console.error('Error saving journal entry:', error);
      }
    };

    useEffect (() => {
      const fetchData = async () => {
        try {
          const storedEntries = await AsyncStorage.getItem ('journalEntries');
          if (storedEntries) {
            setJournalEntries (JSON.parse (storedEntries));
          }
        } catch (error) {
          console.error ('Error fetching journal entries:', error);
        }
      };
  
      fetchData ();
    }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Daily Journal</Text>
      <TextInput
        multiline
        placeholder="What's going on today?"
        onChangeText={handleChange}
        value={journalText}
        style={styles.textInput}
      />
      <Button title="Save Entry" color="gray" onPress={handleSave} />

      <Text style={styles.label}>Journal Entry:</Text>
      
      <View>
        {journalEntries.map (entry => (
          <View style={styles.entry} key={entry.id}>
            <Text style={styles.entryText}>{entry.text}</Text>
            <Text style={styles.dateText}>
              {new Date (parseInt (entry.id)).toLocaleDateString ()}
            </Text>
          </View>
        ))}
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  entry: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  entryText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 11,
    color: 'gray',
    textAlign: 'right',
  },
  container: {
    flex: 1,
    padding: 16,
    margin: 'auto',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  textInput: {
    height: 250,
    borderColor: colors.defaultButtonColor,
    backgroundColor: colors.defaultButtonColor,
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
  },
});

export default JournalEntry;

