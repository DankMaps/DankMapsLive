// src/screens/MapScreen.js

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform, Linking, Share, FlatList, ActivityIndicator, Alert, Text } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ProvinceSelector from '../components/ProvinceSelector';
import MapMarkers from '../components/MapMarkers';
import ToggleSwitch from '../components/ToggleSwitch';
import SyncButton from '../components/SyncButton';
import StoreModal from '../components/StoreModal';

import { PROVINCE_REGIONS, PROVINCES, COLLAPSED_HEIGHT, EXPANDED_HEIGHT } from '../utils/constants';
import { getRegionForCoordinates } from '../utils/helpers';
import { fetchStoreData } from '../services/api';
import { createSocketConnection } from '../services/socket';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

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
  const [isModalVisible, setIsModalVisible] = useState(false); // Province selector modal visibility

  // Refs
  const socket = useRef(null);
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const modalizeRef = useRef(null);

  // WebSocket Connection
  useEffect(() => {
    socket.current = createSocketConnection(); // Initialize socket connection

    socket.current.on('storeDetailsUpdated', (data) => {
      // Update the specific store in storeData
      setStoreData(prevStoreData => prevStoreData.map(store => store.id === data.id ? data : store));
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
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
    const loadStoreData = async () => {
      try {
        const data = await fetchStoreData();
        setStoreData(data);
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

    loadStoreData();
  }, []);

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

  // Action Handlers
  const handleContact = () => {
    console.log('Contact button pressed');
    const whatsappGroupLink = 'https://chat.whatsapp.com/your-group-link'; // Replace with actual link
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
      navigation.navigate('StorePage', { id: selectedStore.id });
    }
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

  // Function to toggle province modal visibility
  const toggleProvinceModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Function to handle province selection
  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    toggleProvinceModal();
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
        <Header />

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={handleSearchInputChange}
          searchResults={searchResults}
          onResultPress={handleSearchResultPress}
        />

        <ProvinceSelector
          selectedProvince={selectedProvince}
          provinces={PROVINCES}
          isVisible={isModalVisible}
          toggleModal={toggleProvinceModal}
          onSelectProvince={handleProvinceSelect}
        />

        <MapView
          ref={mapRef}
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
          onRegionChangeComplete={setMapRegion}
        >
          <MapMarkers
            storeData={storeData}
            useMarijuanaIcon={useMarijuanaIcon}
            onMarkerPress={(store) => {
              centerMapOnStore(store.latitude, store.longitude);
              handleMarkerPress(store);
            }}
          />
        </MapView>

        <ToggleSwitch
          value={useMarijuanaIcon}
          onValueChange={setUseMarijuanaIcon}
        />

        <SyncButton onPress={centerOnUserLocation} />

        <StoreModal
          modalizeRef={modalizeRef}
          selectedStore={selectedStore}
          onClose={closeModal}
          onContact={handleContact}
          onDirections={handleDirections}
          onShare={handleShare}
          onFavorite={handleFavorite}
          onVisitStore={handleVisitStore}
          getCategoryIcon={getCategoryIcon}
          onCategoryPress={handleCategoryPress}
        />
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
