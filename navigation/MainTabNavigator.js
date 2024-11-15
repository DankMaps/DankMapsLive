// navigation/MainTabNavigator.js

import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Import screen components
import HomePage from '../screens/HomePage';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/Profile';

const Tab = createBottomTabNavigator();

// Custom Add Button Component for Map
function CentralAddButton({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.centralAddButton}
      onPress={onPress}
      accessibilityLabel="Open Map"
    >
      <Image
        source={require('../assets/icons/marijuana.png')}
        style={styles.centralAddButtonIcon}
      />
    </TouchableOpacity>
  );
}

// Main Tab Navigator
export default function MainTabNavigator() {
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

          if (iconName) {
            return (
              <MaterialCommunityIcons name={iconName} color={color} size={size} />
            );
          }

          return null;
        },
        tabBarActiveTintColor: '#23D82CFF',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomePage} 
        options={{ tabBarLabel: 'Home' }} 
      />
      
      <Tab.Screen 
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons name="map" size={24} color={focused ? '#23D82CFF' : 'gray'} />
          ),
          tabBarButton: (props) => (
            <CentralAddButton onPress={props.onPress} />
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

const styles = StyleSheet.create({
  centralAddButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  centralAddButtonIcon: {
    width: 32,
    height: 32,
    tintColor: 'white',
  },
});
