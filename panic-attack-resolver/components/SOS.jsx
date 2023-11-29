import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Linking, ScrollView } from 'react-native';
import * as Contacts from 'expo-contacts';
import { colors } from '../values/colors';
import HotlineSOS from './HotlineSOS';

const windowWidth = Dimensions.get('window').width;

const SOS = () => {
  const [contacts, setContacts] = useState([]);

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

  const handleCallContact = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <ScrollView style={styles.container}>
      <HotlineSOS />

      <Text style={styles.label}>Contacts:</Text>
      {contacts.map((item) => (
        <View key={item.id} style={styles.contactItem}>
          
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactNumber}>
              {item.phoneNumbers ? item.phoneNumbers[0].number : 'No phone number'}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => handleCallContact(item.phoneNumbers[0].number)}
            style={styles.callButton}
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
  callButton: {
    backgroundColor: colors.specialButtonColor,
    padding: 8,
    borderRadius: 4,
  },
  callButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SOS;