// screens/LoginScreen.js

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Animated,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button, Title, Text } from 'react-native-paper';
// Removed axios import since we're not using it in test mode
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const slideAnim = useRef(new Animated.Value(500)).current;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Updated test account credentials
  const TEST_USERNAME = 'test';
  const TEST_PASSWORD = '1';
  const TEST_EMAIL = 'test@example.com'; // Assigned email for the test user

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        Alert.alert('Error', 'Please enter a username and password');
        return;
      }

      setLoading(true);

      // Check if the entered credentials match the test account
      if (
        username.trim().toLowerCase() === TEST_USERNAME.toLowerCase() &&
        password === TEST_PASSWORD
      ) {
        // Save user data to AsyncStorage
        await AsyncStorage.setItem('userId', '1');
        await AsyncStorage.setItem('userName', TEST_USERNAME);
        await AsyncStorage.setItem('email', TEST_EMAIL);
        setLoading(false);
        navigation.replace('Main');
      } else {
        setLoading(false);
        Alert.alert('Error', 'Invalid username or password');
      }
    } catch (error) {
      setLoading(false);
      console.log('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred during login');
    }
  };

  const handleRegister = () => {
    Alert.alert(
      'Registration Disabled',
      'Registration is disabled in test mode.'
    );
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  return (
    <ImageBackground
      source={require('../assets/loginbackground.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          <Image
            source={require('../assets/DankMaps.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Title style={styles.title}>Welcome Back!</Title>

        {/* Username Input */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#000"
          value={username}
          onChangeText={setUsername}
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

        {/* Login Button */}
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          buttonColor="#00bf63"
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        {/* Register Link */}
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Terms of Use and Privacy Policy Links */}
        <View style={styles.linksContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TermsOfUse')}
            accessibilityLabel="View Terms of Use"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>Terms of Use</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyPolicy')}
            accessibilityLabel="View Privacy Policy"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
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
  logo: {
    width: 350,
    height: 350,
    alignSelf: 'center',
    marginBottom: 50,
  },
  title: {
    marginTop: -70,
    alignSelf: 'center',
    marginBottom: 20,
    fontSize: 24,
    color: '#ffffff',
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
  divider: {
    marginVertical: 30,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  linkText: {
    color: '#00bf63',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});
