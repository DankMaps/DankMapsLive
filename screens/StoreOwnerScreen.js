// screens/StoreOwnerScreen.js

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import io from 'socket.io-client';

export default function StoreOwnerScreen({ route }) {
  const [storeDetails, setStoreDetails] = useState(''); // State to store the details of the store
  const [operatingHours, setOperatingHours] = useState(''); // State to store the operating hours

  const markerID = '1'; // This should be dynamically set based on the logged-in store owner's marker ID
  const socket = useRef(null); // WebSocket reference

  // Establish WebSocket connection on mount
  useEffect(() => {
    socket.current = io('http://localhost:5000'); // Connect to the WebSocket server

    return () => {
      socket.current.disconnect(); // Clean up the WebSocket connection on unmount
    };
  }, []);

  // Function to handle updating store information
  const updateStoreInfo = async () => {
    // Validate input fields
    if (storeDetails === '' || operatingHours === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Make a POST request to update store information (optional backend update)
      const response = await fetch('http://192.168.1.12:5000/update-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markerID, // Pass the markerID correctly
          storeDetails,
          operatingHours,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Send real-time update to WebSocket server
        socket.current.emit('storeDetailsUpdated', {
          markerID,
          storeDetails,
        });

        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Error', result.message || 'Failed to update store info');
      }
    } catch (error) {
      console.error('Error updating store info:', error);
      Alert.alert('Error', 'Failed to update store info');
    }
  };

  return (
    <View style={styles.container}>
      {/* Input field for Store Details */}
      <Text style={styles.label}>Store Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter store details"
        value={storeDetails}
        onChangeText={setStoreDetails}
      />

      {/* Input field for Operating Hours */}
      <Text style={styles.label}>Operating Hours</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter operating hours"
        value={operatingHours}
        onChangeText={setOperatingHours}
      />

      {/* Button to trigger the updateStoreInfo function */}
      <Button title="Update Info" onPress={updateStoreInfo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
