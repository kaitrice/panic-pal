import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// currently each journal entry stays on each day of the calender
// want each day of calendar to have its own separate journal entry
// need a way to associate journal entries with specific dates
const JournalEntry = () => {
  const [entryText, setEntryText] = useState ('');
  const [journalEntries, setJournalEntries] = useState ([]);

  // Function to save a journal entry to AsyncStorage
  const saveJournalEntry = async entry => {
    try {
      const existingEntries = await AsyncStorage.getItem ('journalEntries');
      const entries = existingEntries ? JSON.parse (existingEntries) : [];
      entries.push ({text: entry, date: new Date ().toLocaleString ()});
      await AsyncStorage.setItem ('journalEntries', JSON.stringify (entries));
    } catch (error) {
      console.error ('Error saving entry:', error);
    }
  };

  // Function to retrieve journal entries from AsyncStorage
  const getJournalEntries = async () => {
    try {
      const entries = await AsyncStorage.getItem ('journalEntries');
      return entries ? JSON.parse (entries) : [];
    } catch (error) {
      console.error ('Error retrieving entries:', error);
      return [];
    }
  };

  // Function to save the current journal entry
  const saveEntry = async () => {
    if (entryText.trim () === '') {
      console.warn ('Entry text is empty. Please write something.');
      return;
    }

    try {
      await saveJournalEntry (entryText);
      console.log ('Journal entry saved successfully.');
      setEntryText ('');
      loadEntries ();
    } catch (error) {
      console.error ('Error saving journal entry:', error);
    }
  };

  // Function to load journal entries from storage
  const loadEntries = async () => {
    const entries = await getJournalEntries ();
    setJournalEntries (entries);
  };

  // Load journal entries on component mount
  useEffect (() => {
    loadEntries ();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Daily Journal</Text>
      <TextInput
        multiline
        placeholder="What's going on today?"
        value={entryText}
        onChangeText={text => setEntryText (text)}
        style={styles.textInput}
      />
      <Button title="Save Entry" color="#bbb" onPress={saveEntry} />

      <Text style={styles.label}>Journal Entries:</Text>
      {journalEntries.map ((entry, index) => (
        <View key={index} style={styles.entryContainer}>
          <Text>{entry.text}</Text>
          <Text style={styles.text}>
            {entry.date}
          </Text>
        </View>
      ))}

    </View>
  );
};

const styles = StyleSheet.create ({
  text: {
    fontSize: 10,
    fontStyle: 'light',
  },
  container: {
    flex: 1,
    padding: 3,
    fontSize: 12,
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
    height: 300,
    borderColor: '#82C2E5',
    backgroundColor: '#82C2E5',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
  },
  entryContainer: {
    padding: 10,
  },
});

export default JournalEntry;
