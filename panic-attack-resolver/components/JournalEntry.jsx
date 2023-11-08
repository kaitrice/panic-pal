import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JournalEntry = () => {
    const [journalText, setJournalText] = useState('');
    const [journalEntries, setJournalEntries] = useState([]);

    const handleChange = (text) => {
      setJournalText(text);
    }
  
    const handleSave = async () => {
      try {
        // Save the new journal entry
        const newEntry = { id: Date.now().toString(), text: journalText };
        journalEntries.push(newEntry);
        await AsyncStorage.setItem('journalEntries', JSON.stringify([...journalEntries, newEntry]));
        setJournalText('');
        console.log(JSON.stringify(journalEntries));
      } catch (error) {
        console.error('Error saving journal entry:', error);
      }
    };

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
      <Button title="Save Entry" color="#bbb" onPress={handleSave} />

      <Text style={styles.label}>Journal Entry:</Text>
      
      <View>
        {journalEntries.map((entry) => (
             <Text>{(entry.text)}</Text>
        ))}
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    borderColor: '#82C2E5',
    backgroundColor: '#82C2E5',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
  },
});

export default JournalEntry;

