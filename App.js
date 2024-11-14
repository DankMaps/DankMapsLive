// App.js

import 'react-native-get-random-values'; // Ensure this is at the very top
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from './theme'; // Import your custom themes

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainTabNavigator from './navigation/MainTabNavigator';
import TermsOfUse from './screens/TermsOfUse'; // Import TermsOfUse
import PrivacyPolicy from './screens/PrivacyPolicy'; // Import PrivacyPolicy

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const colorScheme = useColorScheme(); // Detects system color scheme

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        setInitialRoute(userId ? 'Main' : 'Login');
      } catch (error) {
        console.log('Error checking user:', error);
        setInitialRoute('Login'); // Default to Login on error
      }
    };
    checkUser();
  }, []);

  if (!initialRoute) {
    // Render a loading indicator while checking auth state
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainTabNavigator} />
          {/* Add TermsOfUse and PrivacyPolicy screens */}
          <Stack.Screen name="TermsOfUse" component={TermsOfUse} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
