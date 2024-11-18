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
import { Chip } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

export default function StorePage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

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

  const handleContact = () => {
    if (store && store.website) {
      Linking.openURL(store.website).catch((err) =>
        console.error('Error opening website:', err)
      );
    } else {
      Alert.alert('Error', 'No contact information available.');
    }
  };

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

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'CBD':
        return <FontAwesome5 name="leaf" size={16} color="#4CAF50" />;
      case 'THC':
        return <MaterialIcons name="local-florist" size={16} color="#F44336" />;
      case 'Clubs':
        return <MaterialIcons name="group" size={16} color="#FF9800" />;
      case 'Oils':
        return <MaterialIcons name="opacity" size={16} color="#9C27B0" />;
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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFC107" />
        <Text style={styles.loadingText}>Loading store information...</Text>
      </View>
    );
  }

  if (!store) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Store not found.</Text>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFC107" />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.storeTitle}>{store.title}</Text>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image
          source={
            store.logo
              ? { uri: store.logo }
              : require('../assets/default-logo.png')
          }
          style={styles.storeImage}
          resizeMode="contain" // Changed to 'contain'
          accessible={true}
          accessibilityLabel={`${store.title} Logo`}
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.storeDescription}>{store.description}</Text>

          <View style={styles.categoriesContainer}>
            {store.categories &&
              store.categories.map((category, index) => (
                <Chip
                  key={index}
                  icon={() => getCategoryIcon(category)}
                  onPress={() => Alert.alert('Category', category)}
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {category}
                </Chip>
              ))}
          </View>

          {store.website ? (
            <TouchableOpacity onPress={handleContact} style={styles.websiteButton}>
              <MaterialIcons name="web" size={24} color="#FFFFFF" />
              <Text style={styles.websiteButtonText}>Visit Website</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            onPress={handleContact}
            style={styles.actionButton}
            accessibilityLabel="Contact"
          >
            <MaterialIcons name="phone" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDirections}
            style={styles.actionButton}
            accessibilityLabel="Directions"
          >
            <MaterialIcons name="directions" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            style={styles.actionButton}
            accessibilityLabel="Share"
          >
            <MaterialIcons name="share" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const ACCENT_COLOR = '#FFC107';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Changed background to white
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  storeTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 28,
    color: '#000000', // Changed text color to black
    textAlign: 'center',
    marginBottom: 16,
  },
  contentContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  storeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#FFFFFF', // Match background color
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  storeDescription: {
    fontSize: 16,
    color: '#333333', // Darker text color for readability
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
    backgroundColor: '#F0F0F0',
    borderColor: ACCENT_COLOR,
    borderWidth: 1,
  },
  chipText: {
    color: '#000000',
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT_COLOR,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  websiteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: ACCENT_COLOR,
    borderRadius: 30,
    marginHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Changed to white
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000000', // Dark text color
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Changed to white
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
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
    color: '#FFC107',
  },
});
