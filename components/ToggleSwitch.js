// src/components/ToggleSwitch.js

import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';

const ToggleSwitch = ({ value, onValueChange }) => {
  return (
    <View style={styles.toggleContainer}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? '#2e7d32' : '#f4f3f4'}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        ios_backgroundColor="#3e3e3e"
        accessibilityLabel="Toggle Marker Icons"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    position: 'absolute',
    bottom: 30, // Adjusted for spacing from bottom
    left: 20,
    backgroundColor: 'transparent', // Removed white background
    padding: 0, // Removed padding
    borderRadius: 20,
    // Optional: Add shadow for better visibility against the map
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2, // For Android shadow
  },
});

export default ToggleSwitch;
