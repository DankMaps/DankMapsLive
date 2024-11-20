// screens/RegisterScreen.js

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Button, Title, Text } from 'react-native-paper';
import { auth } from '../firebase'; // Import Firebase auth
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Update the display name
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });

      setLoading(false);
      Alert.alert('Success', 'Account created successfully');
      navigation.replace('Main');
    } catch (error) {
      setLoading(false);
      console.log('Registration error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../assets/loginbackground.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Title style={styles.title}>Register</Title>

        {/* Display Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Display Name"
          placeholderTextColor="#000"
          value={displayName}
          onChangeText={setDisplayName}
        />

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#000"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#000"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Confirm Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#000"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Register Button */}
        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          buttonColor="#00bf63"
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>

        {/* Back to Login Link */}
        <TouchableOpacity onPress={handleBackToLogin}>
          <Text style={styles.registerText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
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
  input: {
    height: 50,
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingHorizontal: 10,
    color: '#000',
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
    alignSelf: 'center',
    width: '80%',
    height: 50,
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonLabel: {
    fontSize: 18,
    color: '#ffffff',
  },
  registerText: {
    marginTop: 20,
    alignSelf: 'center',
    color: '#fff',
    textDecorationLine: 'underline',
  },
});
