// src/components/ProvinceSelector.js

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const ProvinceSelector = ({ selectedProvince, provinces, isVisible, toggleModal, onSelectProvince }) => {

  const handleProvinceSelect = (province) => {
    onSelectProvince(province);
    toggleModal();
  };

  return (
    <>
      <TouchableOpacity style={styles.customPickerButton} onPress={toggleModal} accessibilityLabel="Open Province Selector">
        <Text style={styles.customPickerButtonText}>{selectedProvince}</Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#2e7d32" />
      </TouchableOpacity>

      <Modal 
        isVisible={isVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        style={styles.modalWrapper}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Province</Text>
          <FlatList
            data={provinces}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.modalItem} 
                onPress={() => handleProvinceSelect(item)}
                accessibilityLabel={`Select ${item}`}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={toggleModal} accessibilityLabel="Close Province Selector">
            <Text style={styles.modalCloseButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  customPickerButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 160 : StatusBar.currentHeight + 130, // Positioned below search bar
    left: 20,
    right: 20,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.2, // For iOS shadow
    shadowRadius: 2, // For iOS shadow
  },
  customPickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalWrapper: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalItem: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2e7d32',
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProvinceSelector;
