// screens/MapScreen.js

import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text, 
  TouchableOpacity, 
  Dimensions,
  Platform,
  Linking,
  Share,
  ScrollView,
  StatusBar,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';
import { Card } from 'react-native-paper';
import axios from 'axios';
import { Modalize } from 'react-native-modalize'; // eslint-disable-line
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Modal from 'react-native-modal'; // Import react-native-modal

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLLAPSED_HEIGHT = SCREEN_HEIGHT * 0.4;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.8;

// Define map regions for each province
const PROVINCE_REGIONS = {
  Gauteng: {
    latitude: -25.746111,
    longitude: 28.188056,
    latitudeDelta: 1.0,
    longitudeDelta: 1.0,
  },
  'KwaZulu-Natal': {
    latitude: -29.858680,
    longitude: 31.021840,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  },
  'Cape Town': {
    latitude: -33.924870,
    longitude: 18.424055,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  },
};

export default function MapScreen() {
  // State Management
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useMarijuanaIcon, setUseMarijuanaIcon] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('Gauteng'); // Default province
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility

  // Refs
  const socket = useRef(null);
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const modalizeRef = useRef(null);

  // Replace with your API endpoint
  const API_URL = 'http://darksamarai.ddns.net:3000/api/clients'; // Update this to your actual IP or Ngrok URL

  // Province list
  const provinces = ['Gauteng', 'KwaZulu-Natal', 'Cape Town'];

  // Helper function to calculate region that fits given coordinates
  const getRegionForCoordinates = (points) => {
    if (points.length === 0) return null;
  
    let minLat, maxLat, minLng, maxLng;
    
    // Initialize min and max with the first point
    minLat = maxLat = points[0].latitude;
    minLng = maxLng = points[0].longitude;
  
    // Iterate over points to find min and max
    points.forEach(point => {
      minLat = Math.min(minLat, point.latitude);
      maxLat = Math.max(maxLat, point.latitude);
      minLng = Math.min(minLng, point.longitude);
      maxLng = Math.max(maxLng, point.longitude);
    });
  
    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
  
    const latitudeDelta = (maxLat - minLat) * 1.5 || 0.05; // Add some padding
    const longitudeDelta = (maxLng - minLng) * 1.5 || 0.05; // Add some padding
  
    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta,
      longitudeDelta,
    };
  };

  // WebSocket Connection
  useEffect(() => {
    socket.current = io('http://your-server-url.com'); // Replace with your server URL

    socket.current.on('storeDetailsUpdated', (data) => {
      // Handle store updates if using state for store data
      // Example: Update the specific store in storeData
      setStoreData(prevStoreData => prevStoreData.map(store => store.id === data.id ? data : store));
    });

    return () => {
      socket.current.disconnect(); // Clean up WebSocket connection on component unmount
    };
  }, []);

  // Fetch User Location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    })();
  }, []);

  // Fetch Store Data from API
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get(API_URL, { timeout: 10000 }); // 10 seconds timeout
        setStoreData(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error('Server responded with status:', error.response.status);
          console.error('Response data:', error.response.data);
          Alert.alert('Error', `Server Error: ${error.response.status}`);
        } else if (error.request) {
          // Request was made but no response received
          console.error('No response received:', error.request);
          Alert.alert('Error', 'No response from server. Please check your network connection.');
        } else {
          // Something else happened
          console.error('Error:', error.message);
          Alert.alert('Error', 'An unexpected error occurred.');
        }
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [API_URL]);

  // Calculate Initial Map Region based on selected province
  useEffect(() => {
    const region = PROVINCE_REGIONS[selectedProvince];
    setMapRegion(region);
  }, [selectedProvince, storeData, location]);

  // Hide Navigation Header
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Center Map on User Location
  const centerOnUserLocation = async () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    } else {
      // If location is not available, fetch it
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);

      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  // Center Map on Selected Store
  const centerMapOnStore = (latitude, longitude) => {
    const latitudeDelta = mapRegion ? mapRegion.latitudeDelta : 0.01;
    const longitudeDelta = mapRegion ? mapRegion.longitudeDelta : 0.01;

    // Adjust latitude to move the marker up in the visible region
    const offsetFactor = -0.25;
    const newLatitude = latitude + latitudeDelta * offsetFactor;

    mapRef.current.animateToRegion(
      {
        latitude: newLatitude,
        longitude: longitude,
        latitudeDelta,
        longitudeDelta,
      },
      500
    );
  };

  // Handle Marker Press
  const handleMarkerPress = (store) => {
    console.log('Marker pressed:', store.id);
    setSelectedStore(store); // Set the selected store for modal
    modalizeRef.current?.open(); // Open the modal
  };

  // Close Modal
  const closeModal = () => {
    console.log('Modal closed');
    setSelectedStore(null); // Clear selected store
  };

  // Close Button Press Handler
  const handleCloseButtonPress = () => {
    modalizeRef.current?.close(); // Close the modal
  };

  // Action Handlers
  const handleContact = () => {
    console.log('Contact button pressed');
    const whatsappGroupLink = 'https://chat.whatsapp.com/your-group-link';
    Linking.openURL(whatsappGroupLink).catch(err => console.error('Error:', err));
  };

  const handleDirections = () => {
    console.log('Directions button pressed');
    if (!selectedStore) return;
    const { latitude, longitude } = selectedStore;
    const url = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}`,
    });
    Linking.openURL(url).catch(err => console.error('Error:', err));
  };

  const handleShare = async () => {
    console.log('Share button pressed');
    if (!selectedStore) return;
    try {
      const result = await Share.share({
        message: `Check out ${selectedStore.title} at ${selectedStore.website}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
      Alert.alert('Error', 'Failed to share the store details.');
    }
  };

  const handleFavorite = () => {
    console.log('Favorite button pressed');
    // Implement favorite toggle logic here
    Alert.alert('Favorite', 'Store added to favorites.');
  };

  const handleVisitStore = () => {
    if (selectedStore) {
      navigation.navigate('StorePage', { storeId: selectedStore.id });
    }
  };

  // Handle Modal Position Changes (Optional)
  const handleModalPosition = () => {
    // Optional: Handle modal position changes
  };

  // Safe Region Change Handler
  const handleRegionChangeComplete = (newRegion) => {
    if (
      !mapRegion ||
      mapRegion.latitude !== newRegion.latitude ||
      mapRegion.longitude !== newRegion.longitude ||
      mapRegion.latitudeDelta !== newRegion.latitudeDelta ||
      mapRegion.longitudeDelta !== newRegion.longitudeDelta
    ) {
      setMapRegion(newRegion);
    }
  };

  // Handle Search Input Change
  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setSearchResults([]);
    } else {
      // Filter storeData based on the search query
      const results = storeData.filter(store =>
        store.title.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  // Handle Search Result Press
  const handleSearchResultPress = (store) => {
    setSearchQuery(''); // Clear search query
    setSearchResults([]); // Clear search results
    centerMapOnStore(store.latitude, store.longitude);
    handleMarkerPress(store);
  };

  // Get Category Icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'CBD':
        return <FontAwesome5 name="leaf" size={16} color="#4CAF50" />;
      case 'THC':
        return (
          <MaterialIcons name="local-florist" size={16} color="#F44336" />
        );
      case 'Clubs':
        return <MaterialIcons name="group" size={16} color="#FF9800" />;
      case 'Oils':
        return <MaterialIcons name="oil-barrel" size={16} color="#9C27B0" />;
      case 'Edibles':
        return <MaterialIcons name="cake" size={16} color="#FFEB3B" />;
      case 'Flower':
        return <FontAwesome5 name="spa" size={16} color="#8BC34A" />;
      case 'Delivery':
        return (
          <MaterialIcons name="delivery-dining" size={16} color="#03A9F4" />
        );
      default:
        return null;
    }
  };

  // Handle Category Press
  const handleCategoryPress = (category) => {
    console.log('Category pressed:', category);
    // Optionally, implement filtering or navigation based on category
    Alert.alert('Category Pressed', `You pressed the ${category} category.`);
  };

  // Navigate to Home Page
  const navigateToHome = () => {
    navigation.navigate('Home'); // Adjust the route name if needed
  };

  // Function to toggle modal visibility
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Function to handle province selection
  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    toggleModal();
  };

  if (loading) {
    // Display a loading indicator while fetching data
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Loading stores...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header Container */}
        <View style={styles.headerContainer}>
          {/* Logo */}
          <Image
            source={require('../assets/DankMaps.png')} // Ensure correct path
            style={styles.logo}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel="DankMaps Logo"
          />

          {/* Home Icon */}
          <TouchableOpacity onPress={navigateToHome} style={styles.homeButton} accessibilityLabel="Go to Home">
            <MaterialIcons name="home" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search for stores"
            value={searchQuery}
            onChangeText={handleSearchInputChange}
            style={styles.searchInput}
            accessibilityLabel="Search for stores"
          />
          {/* Display search results */}
          {searchResults.length > 0 && (
            <View style={styles.searchResultsContainer}>
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.searchResultItem}
                    onPress={() => handleSearchResultPress(item)}
                    accessibilityLabel={`Select ${item.title}`}
                  >
                    <Text style={styles.searchResultText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* Province Selector Button */}
        <TouchableOpacity style={styles.customPickerButton} onPress={toggleModal} accessibilityLabel="Open Province Selector">
          <Text style={styles.customPickerButtonText}>{selectedProvince}</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#2e7d32" />
        </TouchableOpacity>

        {/* Custom Modal for Province Selection */}
        <Modal 
          isVisible={isModalVisible}
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

        {/* Map View with Markers */}
        <MapView
          ref={mapRef}
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {storeData && storeData.map((store) => (
            <Marker
              key={store.id}
              coordinate={{
                latitude: store.latitude,
                longitude: store.longitude,
              }}
              onPress={() => { 
                centerMapOnStore(store.latitude, store.longitude); 
                handleMarkerPress(store); 
              }}
              anchor={{ x: 0.5, y: 1 }}
              calloutEnabled={false}
            >
              {/* Conditional Marker Icon */}
              <Image
                source={
                  useMarijuanaIcon
                    ? require('../assets/marijuana.png') // Custom marijuana icon
                    : (store.logo
                        ? (typeof store.logo === 'string' ? { uri: store.logo } : store.logo)
                        : require('../assets/default-logo.png') // Provide a default image
                      )
                }
                style={styles.markerImage}
                accessibilityLabel={`${store.title} Marker`}
              />
            </Marker>
          ))}
        </MapView>

        {/* Toggle Switch at Bottom Left */}
        <View style={styles.toggleContainer}>
          <Switch
            value={useMarijuanaIcon}
            onValueChange={(value) => setUseMarijuanaIcon(value)}
            thumbColor={useMarijuanaIcon ? '#2e7d32' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            ios_backgroundColor="#3e3e3e"
            accessibilityLabel="Toggle Marker Icons"
          />
        </View>

        {/* Sync to My Location Button at Bottom Right */}
        <TouchableOpacity
          style={styles.syncButton}
          onPress={centerOnUserLocation}
          accessibilityLabel="Sync to My Location"
        >
          <Image
            source={require('../assets/sync.png')} // Ensure correct path to your sync icon
            style={styles.syncIcon}
          />
        </TouchableOpacity>

        {/* Modal for Store Details */}
        <Modalize
          ref={modalizeRef}
          snapPoint={COLLAPSED_HEIGHT}
          modalHeight={EXPANDED_HEIGHT}
          onPositionChange={handleModalPosition}
          handleStyle={styles.handleContainer}
          handlePosition="inside"
          adjustToContentHeight={false}
          withHandle={false}
          onClosed={closeModal}
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
                  onPress={handleCloseButtonPress} 
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
                            <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => handleCategoryPress(category)}>
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
                    <TouchableOpacity style={styles.actionButton} onPress={handleContact} accessibilityLabel="Contact">
                      <Image
                        source={require('../assets/contact.png')} // Ensure correct path
                        style={styles.actionIcon}
                      />
                      <Text style={styles.actionLabel}>Contact</Text>
                    </TouchableOpacity>

                    {/* Directions Button */}
                    <TouchableOpacity style={styles.actionButton} onPress={handleDirections} accessibilityLabel="Directions">
                      <Image
                        source={require('../assets/directions.png')} // Ensure correct path
                        style={styles.actionIcon}
                      />
                      <Text style={styles.actionLabel}>Directions</Text>
                    </TouchableOpacity>

                    {/* Share Button */}
                    <TouchableOpacity style={styles.actionButton} onPress={handleShare} accessibilityLabel="Share">
                      <Image
                        source={require('../assets/share.png')} // Ensure correct path
                        style={styles.actionIcon}
                      />
                      <Text style={styles.actionLabel}>Share</Text>
                    </TouchableOpacity>

                    {/* Favorite Button */}
                    <TouchableOpacity style={styles.actionButton} onPress={handleFavorite} accessibilityLabel="Favorite">
                      <Image
                        source={require('../assets/favorite.png')} // Ensure correct path
                        style={styles.actionIcon}
                      />
                      <Text style={styles.actionLabel}>Favorite</Text>
                    </TouchableOpacity>

                    {/* Visit Store Button */}
                    <TouchableOpacity
                      onPress={handleVisitStore}
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
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Removed paddingTop as Modalize handles overlapping
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerImage: {
    width: 40, // Reduced size for a more modern look
    height: 40, // Reduced size for a more modern look
    borderRadius: 20,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#fff',
  },
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
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : StatusBar.currentHeight + 80,
    left: 20,
    right: 20,
    zIndex: 2,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc', // Light gray border
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.2, // For iOS shadow
    shadowRadius: 2, // For iOS shadow
  },
  searchResultsContainer: {
    backgroundColor: '#fff',
    maxHeight: 200,
    borderRadius: 5,
    marginTop: 5,
    elevation: 5,
    zIndex: 3,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultText: {
    fontSize: 16,
  },
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
  handleContainer: {
    // Optional: Customize handle appearance if needed
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2e7d32',
  },
});
