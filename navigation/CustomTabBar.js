// navigation/CustomTabBar.js

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CustomTabBar = (props) => {
  const { state, descriptors, navigation } = props;

  return (
    <View style={styles.container}>
      <BottomTabBar {...props} />

      {/* Central Map Button */}
      <TouchableOpacity
        style={styles.centralButton}
        onPress={() => navigation.navigate('Map')}
        activeOpacity={0.7}
        accessibilityLabel="Map Button"
      >
        <MaterialCommunityIcons name="map" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70, // Adjust based on design
    alignItems: 'center',
  },
  centralButton: {
    position: 'absolute',
    top: -30, // Half of the button height to elevate it
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2e7d32', // Customize as needed
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.3, // For iOS shadow
    shadowRadius: 3, // For iOS shadow
  },
});

export default CustomTabBar;
