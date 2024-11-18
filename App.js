// App.js

import 'react-native-get-random-values'; // Ensure this is at the very top
import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  useColorScheme,
  Platform,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from './theme'; // Import your custom themes
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainTabNavigator from './navigation/MainTabNavigator';
import TermsOfUse from './screens/TermsOfUse'; // Import TermsOfUse
import PrivacyPolicy from './screens/PrivacyPolicy'; // Import PrivacyPolicy
import StorePage from './screens/StorePage'; // Import StorePage

// Set the handler for notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Display notifications when app is in foreground
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const colorScheme = useColorScheme(); // Detects system color scheme

  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

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

  useEffect(() => {
    // Request permissions and get the push token
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    // Listener when a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // Handle the notification received
        console.log('Notification received:', notification);
        // You can update your app's state or UI here
      });

    // Listener when a user interacts with a notification (e.g., taps on it)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // Handle the notification response
        console.log('Notification response:', response);
        // Navigate to a specific screen if needed
        // Example:
        // const storeId = response.notification.request.content.data.storeId;
        // if (storeId) {
        //   navigation.navigate('StorePage', { id: storeId });
        // }
      });

    return () => {
      // Clean up listeners on unmount
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!initialRoute) {
    // Render a loading indicator while checking auth state
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
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
          <Stack.Screen
            name="StorePage"
            component={StorePage}
            options={{
              headerShown: true,
              headerTitle: 'Store Details',
              headerTintColor: '#2e7d32',
              headerStyle: {
                backgroundColor: '#fff',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

// Function to register for push notifications and get the token
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      // Ask for permission
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notifications!');
      return;
    }
    // Get the token
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
    // You might want to send the token to your server here
  } else {
    Alert.alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    // Set notification channel for Android
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
