// navigation/MainTabNavigator.js

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform, Text, Image, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

// Import your screen components
import HomePage from '../screens/HomePage';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/Profile';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const ACTIVE_COLOR = '#000'; // Black for active
const INACTIVE_COLOR = '#888'; // Gray for inactive

/**
 * Custom Tab Bar Component
 */
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const activeRouteName = state.routes[state.index].name;

  // Animated value for scaling the Map icon
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (activeRouteName === 'Map') {
      Animated.spring(scaleValue, {
        toValue: 1.2, // Scale up to 1.2 when active
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleValue, {
        toValue: 1, // Scale back to original size when inactive
        useNativeDriver: true,
      }).start();
    }
  }, [activeRouteName]);

  return (
    <View style={styles.tabBarContainer}>
      {/* Profile Button */}
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeRouteName === 'Profile' ? styles.activeTab : null,
        ]}
        onPress={() => navigation.navigate('Profile')}
        accessibilityLabel="Profile Button"
        accessibilityRole="button"
      >
        <MaterialIcons
          name="person"
          size={activeRouteName === 'Profile' ? 38 : 35} // Slightly larger if active
          color={activeRouteName === 'Profile' ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
        {/* Black Line Indicator */}
        {activeRouteName === 'Profile' && <View style={styles.indicator} />}
        {/* Optional Label */}
        {/* <Text style={styles.label}>Profile</Text> */}
      </TouchableOpacity>

      {/* Map Button with Custom Image and Scaling Animation */}
      <TouchableOpacity
        style={[
          styles.centralButton,
          activeRouteName === 'Map' ? styles.activeCentralButton : null,
        ]}
        onPress={() => navigation.navigate('Map')}
        accessibilityLabel="Map Button"
        accessibilityRole="button"
      >
        <Animated.Image
          source={require('../assets/icons/marijuana.png')}
          style={[
            styles.mapIcon,
            { transform: [{ scale: scaleValue }] },
            activeRouteName === 'Map' ? styles.mapIconActive : null,
          ]}
          resizeMode="contain"
        />
        {/* Black Line Indicator */}
        {activeRouteName === 'Map' && <View style={styles.indicator} />}
      </TouchableOpacity>

      {/* Home Button */}
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeRouteName === 'Home' ? styles.activeTab : null,
        ]}
        onPress={() => navigation.navigate('Home')}
        accessibilityLabel="Home Button"
        accessibilityRole="button"
      >
        <MaterialIcons
          name="home"
          size={activeRouteName === 'Home' ? 38 : 35} // Slightly larger if active
          color={activeRouteName === 'Home' ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
        {/* Black Line Indicator */}
        {activeRouteName === 'Home' && <View style={styles.indicator} />}
        {/* Optional Label */}
        {/* <Text style={styles.label}>Home</Text> */}
      </TouchableOpacity>
    </View>
  );
};

/**
 * Tabs Component with Custom Tab Bar
 */
function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Hide labels
        tabBarStyle: { display: 'none' }, // Hide default tab bar
      }}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          // No need for tabBarIcon since we're using a custom tab bar
        }}
      />

      {/* Map Tab */}
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          // No need for tabBarIcon since we're using a custom tab bar
        }}
      />

      {/* Profile Tab */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          // No need for tabBarIcon since we're using a custom tab bar
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Main Navigator with Stack (for future scalability)
 */
export default function MainTabNavigator() {
  return <Tabs />;
}

/**
 * Styles
 */
const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40, // Adjust as needed
    left: 25,
    right: 25,
    backgroundColor: '#fff',
    height: 60, // Increased height for better spacing
    borderRadius: 30,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Ensures equal spacing
    paddingVertical: 10,
    position: 'relative', // To position the indicator absolutely within
  },
  centralButton: {
    position: 'absolute',
    top: -25, // Elevate the button above the tab bar
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Black background
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.3, // For iOS shadow
    shadowRadius: 3, // For iOS shadow
  },
  activeTab: {
    // Optional: Additional styles for active tab if needed
  },
  activeCentralButton: {
    // Example: Change background color when active
    backgroundColor: '#000', // Keeps the same background
    // Example: Add a border or shadow to highlight
    borderWidth: 2,
    borderColor: '#fff',
  },
  mapIcon: {
    width: 35, // Original width
    height: 35, // Original height
    tintColor: '#fff', // If you want to tint the image
  },
  // mapIconActive: {
  //   width: 45, // Increased width when active
  //   height: 45, // Increased height when active
  //   tintColor: '#fff',
  //   // Optional: Add shadow to make it stand out
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.5,
  //   shadowRadius: 4,
  //   elevation: 8, // Increased elevation for a more prominent shadow
  // },
  indicator: {
    position: 'absolute',
    bottom: 5, // Adjust to position the line correctly
    width: 10, // Shortened width (half of original 20)
    height: 2, // Thickness of the black line
    backgroundColor: '#000', // Black color
    borderRadius: 1, // Rounded edges
  },
  label: {
    fontSize: 12,
    color: '#000',
    marginTop: 4,
  },
});
