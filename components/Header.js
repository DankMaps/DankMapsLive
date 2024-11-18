// src/components/Header.js

import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('../assets/DankMaps.png')} // Ensure the path is correct
        style={styles.logo}
        resizeMode="contain"
        accessible={true}
        accessibilityLabel="DankMaps Logo"
      />
      <TouchableOpacity onPress={navigateToHome} style={styles.homeButton} accessibilityLabel="Go to Home">
        <MaterialIcons name="home" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight + 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  homeButton: {
    padding: 5,
  },
});

export default Header;
