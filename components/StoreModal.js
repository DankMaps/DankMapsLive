// src/components/StoreModal.js

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { Modalize } from 'react-native-modalize';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'; // Ensure correct import
import { COLLAPSED_HEIGHT, EXPANDED_HEIGHT } from '../utils/constants';
import PropTypes from 'prop-types';

const StoreModal = ({
  modalizeRef,
  selectedStore,
  onClose,
  onContact,
  onDirections,
  onShare,
  onFavorite,
  onVisitStore,
  onCategoryPress,
}) => {

  // Define getCategoryIcon within StoreModal to ensure FontAwesome5 is in scope
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'CBD':
        return <FontAwesome5 name="leaf" size={16} color="#4CAF50" />;
      case 'THC':
        return <MaterialIcons name="local-florist" size={16} color="#F44336" />;
      case 'Clubs':
        return <MaterialIcons name="group" size={16} color="#FF9800" />;
      case 'Oils':
        return <MaterialIcons name="oil-barrel" size={16} color="#9C27B0" />;
      case 'Edibles':
        return <MaterialIcons name="cake" size={16} color="#FFEB3B" />;
      case 'Flower':
        return <FontAwesome5 name="spa" size={16} color="#8BC34A" />;
      case 'Delivery':
        return <MaterialIcons name="delivery-dining" size={16} color="#03A9F4" />;
      default:
        return null;
    }
  };

  return (
    <Modalize
      ref={modalizeRef}
      snapPoint={COLLAPSED_HEIGHT}
      modalHeight={EXPANDED_HEIGHT}
      onClosed={onClose}
      modalStyle={styles.modal}
    >
      <View style={styles.modalContent}>
        {/* Modal Header */}
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => { /* Optionally handle modal size toggle here */ }} 
          accessibilityLabel="Toggle Modal Size"
        >
          <View style={styles.modalHeader}>
            <View style={styles.handle} />
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.closeButton} 
              accessibilityLabel="Close Modal"
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Modal Content */}
        <ScrollView
          contentContainerStyle={styles.scrollView}
        >
          {selectedStore && (
            <>
              {/* Store Details Card */}
              <Card style={styles.listingCard} elevation={0}>
                <View style={styles.listingContainer}>
                  <Image
                    source={
                      selectedStore.logo
                        ? (typeof selectedStore.logo === 'string' ? { uri: selectedStore.logo } : selectedStore.logo)
                        : require('../assets/default-logo.png') // Provide a default image
                    }
                    style={styles.listingImage}
                    accessibilityLabel={`${selectedStore.title} Logo`}
                  />
                  <View style={styles.listingInfo}>
                    <Text style={styles.listingName}>{selectedStore.title}</Text>
                    {/* Categories */}
                    <View style={styles.categoriesContainer}>
                      {selectedStore.categories && selectedStore.categories.map((category, index) => (
                        <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => onCategoryPress(category)}>
                          <View style={styles.categoryIconContainer}>
                            {getCategoryIcon(category)}
                          </View>
                          <Text style={styles.categoryText}>{category}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <Text style={styles.listingStatus}>
                      {selectedStore.status === 'open' ? 'Open now' : selectedStore.status === 'closed' ? 'Closed' : 'Status Unavailable'}
                    </Text>
                  </View>
                </View>
              </Card>

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                {/* Contact Button */}
                <TouchableOpacity style={styles.actionButton} onPress={onContact} accessibilityLabel="Contact">
                  <Image
                    source={require('../assets/contact.png')} // Ensure the path is correct
                    style={styles.actionIcon}
                  />
                  <Text style={styles.actionLabel}>Contact</Text>
                </TouchableOpacity>

                {/* Directions Button */}
                <TouchableOpacity style={styles.actionButton} onPress={onDirections} accessibilityLabel="Directions">
                  <Image
                    source={require('../assets/directions.png')} // Ensure the path is correct
                    style={styles.actionIcon}
                  />
                  <Text style={styles.actionLabel}>Directions</Text>
                </TouchableOpacity>

                {/* Share Button */}
                <TouchableOpacity style={styles.actionButton} onPress={onShare} accessibilityLabel="Share">
                  <Image
                    source={require('../assets/share.png')} // Ensure the path is correct
                    style={styles.actionIcon}
                  />
                  <Text style={styles.actionLabel}>Share</Text>
                </TouchableOpacity>

                {/* Favorite Button */}
                <TouchableOpacity style={styles.actionButton} onPress={onFavorite} accessibilityLabel="Favorite">
                  <Image
                    source={require('../assets/favorite.png')} // Ensure the path is correct
                    style={styles.actionIcon}
                  />
                  <Text style={styles.actionLabel}>Favorite</Text>
                </TouchableOpacity>

                {/* Visit Store Button */}
                <TouchableOpacity
                  onPress={onVisitStore}
                  style={styles.actionButton}
                  accessibilityLabel="Visit Store"
                >
                  <Text style={[styles.actionLabel, { color: '#2e7d32', fontWeight: 'bold' }]}>Visit Store</Text>
                </TouchableOpacity>

              </View>
            </>
          )}
        </ScrollView>
      </View>
    </Modalize>
  );
};

StoreModal.propTypes = {
  modalizeRef: PropTypes.object.isRequired,
  selectedStore: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onContact: PropTypes.func.isRequired,
  onDirections: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onFavorite: PropTypes.func.isRequired,
  onVisitStore: PropTypes.func.isRequired,
  onCategoryPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 10,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#2e7d32',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  listingCard: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 0,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    padding: 10,
  },
  listingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listingImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#e0e0e0',
  },
  listingInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  listingName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
  },
  categoryIconContainer: {
    marginRight: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#555',
  },
  listingStatus: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 60,
    height: 60,
    marginBottom: 5,
    resizeMode: 'contain',
    borderWidth: 0,
  },
  actionLabel: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  modal: {
    backgroundColor: 'transparent',
  },
});

export default StoreModal;
