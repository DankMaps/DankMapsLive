// screens/HomePage.js

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image, // Ensure Image is imported
} from 'react-native';
import axios from 'axios';
import { Searchbar, useTheme } from 'react-native-paper';
import TopBar from '../components/TopBar';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import StoreCard from '../components/StoreCard';
import { filterOptions } from '../src/data/filterOptions';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [filteredData, setFilteredData] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const theme = useTheme();
  const navigation = useNavigation(); // Initialize navigation

  // Fetch clients from MongoDB API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://darksamarai.ddns.net:3000/api/clients'); // Replace with your API endpoint
        setFilteredData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clients:", error);
        Alert.alert('Error', 'Failed to load stores. Please try again later.');
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoritesData = await AsyncStorage.getItem('favorites');
        if (favoritesData) {
          setFavorites(JSON.parse(favoritesData));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    filterData(query, selectedFilter);
  };

  const filterData = (query, filter) => {
    let newData = filter === 'All' ? filteredData : filteredData.filter((item) => item.categories.includes(filter));

    if (query) {
      newData = newData.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredData(newData);
  };

  const toggleFavorite = async (id) => {
    try {
      const updatedFavorites = {
        ...favorites,
        [id]: !favorites[id],
      };
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const renderFilterItem = ({ item }) => {
    const isSelected = selectedFilter === item.title;

    return (
      <TouchableOpacity
        style={styles.filterItem}
        onPress={() => {
          setSelectedFilter(item.title);
          filterData(searchQuery, item.title);
        }}
      >
        <View
          style={[
            styles.filterIconContainer,
            isSelected && { backgroundColor: theme.colors.primary },
          ]}
        >
          <Image source={item.icon} style={styles.filterIcon} /> {/* Ensure Image is used correctly */}
        </View>
        <Text
          style={[
            styles.filterText,
            isSelected && { color: theme.colors.primary },
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderStoreCard = ({ item }) => {
    const isFavorite = favorites[item.id];

    // Handler to navigate to StorePage
    const handleVisitStore = () => {
      navigation.navigate('StorePage', { id: item.id.toString() }); // Ensure id is a string
    };

    return (
      <StoreCard
        item={item}
        isFavorite={isFavorite}
        toggleFavorite={() => toggleFavorite(item.id)}
        getCategoryIcon={getCategoryIcon}
        onCategoryPress={handleCategoryPress}
        onVisitStore={handleVisitStore} // Pass the navigation handler
      />
    );
  };

  const handleCategoryPress = (category) => {
    setSelectedFilter(category);
    filterData(searchQuery, category);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'CBD':
        return <FontAwesome5 name="leaf" size={12} color="#4CAF50" />;
      case 'THC':
        return <MaterialIcons name="local-florist" size={12} color="#F44336" />;
      case 'Clubs':
        return <MaterialIcons name="group" size={12} color="#FF9800" />;
      case 'Oils':
        return <MaterialIcons name="oil-barrel" size={12} color="#9C27B0" />;
      case 'Edibles':
        return <MaterialIcons name="cake" size={12} color="#FFEB3B" />;
      case 'Flower':
        return <FontAwesome5 name="spa" size={12} color="#8BC34A" />;
      case 'Delivery':
        return <MaterialIcons name="delivery-dining" size={12} color="#03A9F4" />;
      default:
        return null;
    }
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <TopBar title="Home" />

        {/* Filter Icons */}
        <View style={styles.filterListContainer}>
          <FlatList
            data={filterOptions}
            renderItem={renderFilterItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor={theme.colors.onSurfaceVariant}
            placeholderTextColor={theme.colors.onSurfaceVariant}
            elevation={3}
            icon={() => (
              <MaterialIcons
                name="search"
                size={24}
                color={theme.colors.onSurfaceVariant}
              />
            )}
          />
        </View>

        {/* Store List */}
        <FlatList
          data={filteredData}
          renderItem={renderStoreCard}
          keyExtractor={(item) => item.id.toString()} // Ensure key is a string
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingBottom: 16,
    overflow: 'visible',
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchBar: {
    borderRadius: 30,
    height: 55,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    color: '#000',
    paddingVertical: 0,
    marginVertical: 0,
    justifyContent: 'center',
  },
  filterListContainer: {
    marginBottom: 16,
  },
  filterList: {
    paddingHorizontal: 16,
  },
  filterItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  filterIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    elevation: 3,
  },
  filterIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  filterText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#555',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
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
