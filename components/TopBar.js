// components/TopBar.js

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TopBar = () => {
  const navigation = useNavigation();

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Menu button pressed!');
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      {navigation.canGoBack() && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go Back"
          accessibilityRole="button"
        >
          <MaterialIcons name="arrow-back" size={32} color="#000" />
        </TouchableOpacity>
      )}

      {/* Logo */}
      <Image
        source={require('../assets/DankMaps.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Menu Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={handleMenuPress}
        accessibilityLabel="Open Menu"
        accessibilityRole="button"
      >
        <MaterialIcons name="menu" size={32} color="#00000000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  logo: {
    width: 260,
    height: 95,
  },
  backButton: {
    position: 'absolute',
    left: 25,
    padding: 10,
  },
  menuButton: {
    position: 'absolute',
    right: 25,
    padding: 10,
  },
});

export default TopBar;
