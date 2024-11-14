// navigation/MainTabNavigator.js

import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import screen components
import HomePage from '../screens/HomePage';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/Profile';
import TestStoreScreen from '../screens/TestStoreScreen'; // Adjust the path as necessary


import { createStackNavigator } from '@react-navigation/stack';

// Create Bottom Tab Navigator and Stack Navigator instances
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom Add Button Component for Map
function CentralAddButton({ onPress }) {
  return (
    <TouchableOpacity
      style={{
        top: -10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000', // Set background to black
        width: 70,
        height: 70,
        borderRadius: 35,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 5 },
      }}
      onPress={onPress}
    >
      <Image
        source={require('../assets/icons/marijuana.png')}
        style={{ width: 32, height: 32, tintColor: 'white' }}
      />
    </TouchableOpacity>
  );
}

// Create a function to wrap tabs without a header
function Tabs({ navigation }) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'account';
          }

          return (
            <MaterialCommunityIcons name={iconName} color={color} size={size} />
          );
        },
        tabBarActiveTintColor: '#23D82CFF',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomePage} 
        options={{ tabBarLabel: 'Home' }} 
      />

      <Tab.Screen 
        name="Test" 
        component={TestStoreScreen} 
        options={{ tabBarLabel: 'Test' }} 
      />
      
      <Tab.Screen 
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ focused }) => (
            <CentralAddButton onPress={() => navigation.navigate("Map")} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function MainTabNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={Tabs}
      />
      <Stack.Screen name="TestStore" component={TestStoreScreen} />
      {/* Add other Stack.Screen components here if needed, such as Login, Signup, etc. */}
    </Stack.Navigator>
  );
}
