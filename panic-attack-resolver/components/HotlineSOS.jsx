import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  useColorScheme,
} from 'react-native';
import {colors} from '../values/colors'

const HotlineSOS = () => {
  const [showHotlineOptions, setShowHotlineOptions] = useState (false);
  const theme = useColorScheme();


  const toggleHotlineOptions = () => {
    setShowHotlineOptions (!showHotlineOptions);
  };

  const handleCallHotline = number => {
    Linking.openURL (`tel:${number}`);
  };

  const handleTextHotline = (number, message) => {
    Linking.openURL(`sms:${number}${Platform.OS === "ios" ? "&" : "?"}body=${message}`);
  };
  return (
    <View style={styles.container}>

      <ScrollView style={styles.scrollView}>
        <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.heading]}>Need Someone to Talk To?</Text>
        <Text style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.infoText]}>
          If you're feeling overwhelmed and need someone to talk to, we're here
          for you. Would you like to call a hotline?
        </Text>

        <TouchableOpacity
          onPress={toggleHotlineOptions}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleButtonText}>
            {showHotlineOptions ? 'Hide Hotlines' : 'Show Hotlines'}
          </Text>
        </TouchableOpacity>

        {showHotlineOptions &&
          <View>
            <TouchableOpacity
              onPress={() => handleTextHotline ('741741', 'HELLO')}
              style={styles.hotlineButton}
            >
              <Text style={styles.hotlineButtonText}>
                Crisis Text Line
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCallHotline ('1-866-903-3787')}
              style={styles.hotlineButton}
            >
              <Text style={styles.hotlineButtonText}>
                Mental Health Anxiety Hotline
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCallHotline ('1-800-273-8255')}
              style={styles.hotlineButton}
            >
              <Text style={styles.hotlineButtonText}>
                Crisis Support Services 
              </Text>
            </TouchableOpacity>
          </View>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  toggleButton: {
    backgroundColor: colors.specialButtonColor,
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hotlineButton: {
    backgroundColor: colors.specialButtonColor,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  hotlineButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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

export default HotlineSOS;
