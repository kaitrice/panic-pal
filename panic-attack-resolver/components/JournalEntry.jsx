import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../values/colors'

const JournalEntry = ({selectedDate}) => {
    const [journalText, setJournalText] = useState('');
    const [journalEntries, setJournalEntries] = useState([]);
    const formattedSelectedDate = new Date(selectedDate).toISOString().split('T')[0];
    const theme = useColorScheme();

    const handleChange = (text) => {
      setJournalText(text);
    }
  
    const handleSave = async () => {
      try {
        const currentDate = new Date().toISOString().split('T')[0];
        if (formattedSelectedDate != currentDate) {
          console.log('Cannot create a journal entry for the current date.');
          return;
        }

        const newEntry = { id: `${Date.now()}-${Math.random()}`, text: journalText };
        const entryDate = new Date(parseInt(newEntry.id)).toISOString().split('T')[0];

        const storedEntries = await AsyncStorage.getItem('journalEntries');
        let entries = storedEntries ? JSON.parse(storedEntries) : {};
  
        if (!entries[entryDate]) {
          entries[entryDate] = [];
        }
  
        entries[entryDate].push(newEntry);
  
        await AsyncStorage.setItem('journalEntries', JSON.stringify(entries));
        setJournalEntries(entries);
  
        setJournalText('');
        console.log(JSON.stringify(entries));
        console.log('Selected Date:', formattedSelectedDate);
        console.log('entry Date:', entryDate);
      } catch (error) {
        console.error('Error saving journal entry:', error);
      }
    };

    const handleReset = async () => {
      try {
        await AsyncStorage.removeItem('journalEntries');
        setJournalEntries([]);
      } catch (error) {
        console.error('Error clearing journal entries:', error);
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
      <View style={styles.headerContainer}>
        <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.heading]}>Daily Journal</Text>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Entry</Text>
        </TouchableOpacity>
      </View>
     
      <TextInput
        multiline
        placeholder="What's going on today?"
        onChangeText={handleChange}
        value={journalText}
        style={styles.textInput}
      />
      
      <View style={styles.subheaderContainer}>
        <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.label]}>Journal Entries:</Text>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.buttonText]}>Clear All Entries</Text>
        </TouchableOpacity>
      </View>
      
      <View>
        {journalEntries[formattedSelectedDate]?.map(entry => (
          <View style={styles.entry} key={entry.id}>
            <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.entryText]}>{entry.text}</Text>
            <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.dateText]}>
              {new Date(parseInt(entry.id)).toLocaleTimeString()}
            </Text>
          </View>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subheaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    paddingTop: 15,
  },
  button: {
    backgroundColor: colors.specialButtonColor, 
    padding: 10,
    borderRadius: 5,
    textAlign: 'right',
  },
  buttonText: {
    color: 'white', 
    textAlign: 'center',
    fontWeight: '600',
  },
  textInput: {
    height: 250,
    borderColor: colors.defaultButtonColor,
    backgroundColor: colors.defaultButtonColor,
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
  }, 
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
  lightTheme: {
    // backgroundColor: colors.appBackgroundColor,
    color: colors.darkBackgroundColor
  },
  darkTheme: {
    // backgroundColor: colors.darkBackgroundColor,
    color: colors.appBackgroundColor,
  },
});

export default JournalEntry;