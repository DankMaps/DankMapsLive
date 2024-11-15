// screens/StorePage.js

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
  Share,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar, Chip, Button, useTheme } from 'react-native-paper';

export default function StorePage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params; // Extract the 'id' parameter

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const theme = useTheme();

  // Fetch store data when the component mounts
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get(`http://darksamarai.ddns.net:3000/api/clients/${id}`);
        setStore(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching store data:', error);
        if (error.response && error.response.status === 404) {
          Alert.alert('Store Not Found', 'The requested store does not exist.', [
            { text: 'Go Back', onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert('Error', 'Failed to load store information.');
        }
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [id]);

  // Load favorite status from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoritesData = await AsyncStorage.getItem('favorites');
        if (favoritesData) {
          const parsedFavorites = JSON.parse(favoritesData);
          setFavorite(parsedFavorites[id] || false);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, [id]);

  // Handler for the Contact button
  const handleContact = () => {
    if (store && store.website) {
      Linking.openURL(store.website).catch((err) =>
        console.error('Error opening website:', err)
      );
    } else {
      Alert.alert('Error', 'No contact information available.');
    }
  };

  // Handler for the Directions button
  const handleDirections = () => {
    if (store && store.latitude && store.longitude) {
      const { latitude, longitude } = store;
      const url = Platform.select({
        ios: `maps:0,0?q=${latitude},${longitude}`,
        android: `geo:0,0?q=${latitude},${longitude}`,
      });
      Linking.openURL(url).catch((err) =>
        console.error('Error opening maps:', err)
      );
    } else {
      Alert.alert('Error', 'Location information is unavailable.');
    }
  };

  // Handler for the Share button
  const handleShare = async () => {
    if (store) {
      try {
        const result = await Share.share({
          message: `Check out ${store.title}!\n\n${store.description}\n\nWebsite: ${store.website}`,
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
    }
  };

  // Handler for the Favorite button
  const handleFavorite = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem('favorites');
      let parsedFavorites = favoritesData ? JSON.parse(favoritesData) : {};
      parsedFavorites[id] = !favorite;
      await AsyncStorage.setItem('favorites', JSON.stringify(parsedFavorites));
      setFavorite(!favorite);
      Alert.alert(
        !favorite ? 'Added to Favorites' : 'Removed from Favorites',
        `${store.title} has been ${!favorite ? 'added to' : 'removed from'} your favorites.`
      );
    } catch (error) {
      console.error('Error updating favorites:', error);
      Alert.alert('Error', 'Failed to update favorites.');
    }
  };

  // Handler to navigate back
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Function to get category icons
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

  if (loading) {
    // Display a loading indicator while fetching data
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Loading store information...</Text>
      </View>
    );
  }

  if (!store) {
    // Display an error message if store data is not available
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Store not found.</Text>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#2e7d32" />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title={store.title} />
        <Appbar.Action
          icon={favorite ? 'heart' : 'heart-outline'}
          color={favorite ? theme.colors.error : theme.colors.onSurface}
          onPress={handleFavorite}
          accessibilityLabel="Favorite"
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Store Image */}
        <Image
          source={
            store.logo
              ? { uri: store.logo }
              : require('../assets/default-logo.png') // Provide a default image
          }
          style={styles.storeImage}
          resizeMode="cover"
          accessible={true}
          accessibilityLabel={`${store.title} Logo`}
        />

        {/* Store Description */}
        <View style={styles.detailsContainer}>
          <Text style={styles.storeDescription}>{store.description}</Text>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            {store.categories &&
              store.categories.map((category, index) => (
                <Chip
                  key={index}
                  icon={() => getCategoryIcon(category)}
                  onPress={() => Alert.alert('Category Pressed', category)}
                  style={styles.chip}
                >
                  {category}
                </Chip>
              ))}
          </View>

          {/* Website */}
          {store.website ? (
            <TouchableOpacity onPress={handleContact} style={styles.websiteContainer}>
              <MaterialIcons name="web" size={20} color="#1e88e5" />
              <Text style={styles.websiteText}>{store.website}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <Button
            icon="phone"
            mode="contained"
            onPress={handleContact}
            style={styles.actionButton}
            labelStyle={styles.actionButtonLabel}
            contentStyle={styles.actionButtonContent}
            accessibilityLabel="Contact"
          >
            Contact
          </Button>

          <Button
            icon="map-marker"
            mode="contained"
            onPress={handleDirections}
            style={styles.actionButton}
            labelStyle={styles.actionButtonLabel}
            contentStyle={styles.actionButtonContent}
            accessibilityLabel="Directions"
          >
            Directions
          </Button>

          <Button
            icon="share-variant"
            mode="contained"
            onPress={handleShare}
            style={styles.actionButton}
            labelStyle={styles.actionButtonLabel}
            contentStyle={styles.actionButtonContent}
            accessibilityLabel="Share"
          >
            Share
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2e7d32',
  },
  contentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  storeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#e0e0e0', // Placeholder background color
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  storeDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'justify',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  websiteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  websiteText: {
    fontSize: 16,
    color: '#1e88e5',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#2e7d32',
  },
  actionButtonLabel: {
    fontSize: 14,
    color: '#fff',
  },
  actionButtonContent: {
    flexDirection: 'row-reverse',
    paddingVertical: 8,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#f44336',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#2e7d32',
  },
});
