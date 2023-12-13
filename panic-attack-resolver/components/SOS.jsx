import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Linking, ScrollView, useColorScheme } from 'react-native';
import * as Contacts from 'expo-contacts';
import { colors } from '../values/colors';
import HotlineSOS from './HotlineSOS';

const windowWidth = Dimensions.get('window').width;

const SOS = () => {
  const [contacts, setContacts] = useState([]);
  const theme = useColorScheme();
  

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });
        setContacts(data);
      } else {
        console.log('Permission denied');
      }
    })();
  }, []);

  // for all numbers to look the same on screen
  const formattedPhoneNumber = (phoneNumber) => {
    const cleanedNumber = phoneNumber.replace(/\s/g, "");
    const formattedNumber = cleanedNumber.replace(/[-()]/g, "");

    return formattedNumber.startsWith('+1') ? formattedNumber : `+1${formattedNumber}`;
  };

  const handleCallContact = (phoneNumber) => {
    const cleanedNumber = phoneNumber.replace(/\s/g, "");
    Linking.openURL(`tel:${cleanedNumber}`);
  };

  return (
    <ScrollView style={styles.container}>
      <HotlineSOS />

      <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.label]}>Contacts:</Text>
      {contacts.map((item) => (
        <View key={item.id} style={styles.contactItem}>  
        
          <View style={styles.contactInfo}>
            <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.contactName]}>{item.name}</Text>
            <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.contactNumber]}>
              {item.phoneNumbers ? formattedPhoneNumber(item.phoneNumbers[0].number) : 'No phone number'}
            </Text>
          </View>
          
          <TouchableOpacity
          
            onPress={() => handleCallContact(item.phoneNumbers[0].number )}
            style={!item.phoneNumbers || item.phoneNumbers.length === 0 ? styles.disabledCallButton : styles.callButtonStyle}
            disabled={!item.phoneNumbers || item.phoneNumbers.length === 0}
          >
            <Text style={styles.callButtonText}>Call</Text>
            
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: windowWidth,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactItem: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  contactNumber: {
    fontSize: 16,
    color: '#666',
  },
  callButtonStyle: {
    backgroundColor: colors.sosButtonColor,
    padding: 8,
    borderRadius: 4,
  },
  callButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledCallButton: {
    backgroundColor: '#ccc', // Set the background color to a visually muted color
    padding: 8,
    borderRadius: 4,
  },
  lightTheme: {
    // backgroundColor: colors.appBackgroundColor,
    color: colors.darkBackgroundColor,
  },
  darkTheme: {
    // backgroundColor: colors.darkBackgroundColor,
    color: colors.appBackgroundColor,
  },

});

export default SOS;