// screens/RegisterScreen.js

import React from 'react';
import { View, StyleSheet, ImageBackground, Alert } from 'react-native';
import { Button, Title, Text } from 'react-native-paper';

export default function RegisterScreen({ navigation }) {
  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../assets/loginbackground.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Title style={styles.title}>Registration Disabled</Title>
        <Text style={styles.message}>
          Registration is disabled in test mode. Please use the default test
          account to log in.
        </Text>

        {/* Back to Login Button */}
        <Button
          mode="contained"
          onPress={handleBackToLogin}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          buttonColor="#00bf63"
        >
          Back to Login
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    alignSelf: 'center',
    marginBottom: 20,
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  message: {
    alignSelf: 'center',
    marginBottom: 30,
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  button: {
    alignSelf: 'center',
    width: '60%',
    height: 50,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonLabel: {
    fontSize: 18,
    color: '#ffffff',
  },
});
