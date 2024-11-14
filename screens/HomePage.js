import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Image,
} from 'react-native';
import axios from 'axios';
import { Searchbar, useTheme } from 'react-native-paper';
import TopBar from '../components/TopBar';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import StoreCard from '../components/StoreCard';
import { filterOptions } from '../src/data/filterOptions';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [filteredData, setFilteredData] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [favorites, setFavorites] = useState({});
  const theme = useTheme();

  // Fetch clients from MongoDB API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://darksamarai.ddns.net:3000/api/clients'); // Replace with your API endpoint
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    filterData(query, selectedFilter);
  };

  const filterData = (query, filter) => {
    let newData = filteredData;

    if (filter !== 'All') {
      newData = filteredData.filter((item) => item.categories.includes(filter));
    }

    if (query) {
      newData = newData.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredData(newData);
  };

  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [id]: !prevFavorites[id],
    }));
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
          <Image source={item.icon} style={styles.filterIcon} />
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
    const isExpanded = expandedItems[item.id];
    const isFavorite = favorites[item.id];

    const handleToggleExpand = () => {
      setExpandedItems((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
    };

    const handleCategoryPress = (category) => {
      setSelectedFilter(category);
      filterData(searchQuery, category);
    };

    return (
      <StoreCard
        item={item}
        isExpanded={isExpanded}
        toggleExpand={handleToggleExpand}
        isFavorite={isFavorite}
        toggleFavorite={() => toggleFavorite(item.id)}
        getCategoryIcon={getCategoryIcon}
        onCategoryPress={handleCategoryPress}
      />
    );
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'CBD':
        return <FontAwesome5 name="leaf" size={12} color="#4CAF50" />;
      case 'THC':
        return (
          <MaterialIcons name="local-florist" size={12} color="#F44336" />
        );
      case 'Clubs':
        return <MaterialIcons name="group" size={12} color="#FF9800" />;
      case 'Oils':
        return <MaterialIcons name="oil-barrel" size={12} color="#9C27B0" />;
      case 'Edibles':
        return <MaterialIcons name="cake" size={12} color="#FFEB3B" />;
      case 'Flower':
        return <FontAwesome5 name="spa" size={12} color="#8BC34A" />;
      case 'Delivery':
        return (
          <MaterialIcons name="delivery-dining" size={12} color="#03A9F4" />
        );
      default:
        return null;
    }
  };

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
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
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
});
