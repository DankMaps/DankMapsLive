// src/components/SyncButton.js

import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const SyncButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.syncButton}
      onPress={onPress}
      accessibilityLabel="Sync to My Location"
    >
      <Image
        source={require('../assets/sync.png')} // Ensure the path is correct
        style={styles.syncIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  syncButton: {
    position: 'absolute',
    bottom: 30, // Adjusted for spacing from bottom
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1,
  },
  syncIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default SyncButton;
