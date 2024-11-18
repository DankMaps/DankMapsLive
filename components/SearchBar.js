// src/components/SearchBar.js

import React from 'react';
import { View, TextInput, StyleSheet, FlatList, TouchableOpacity, Text, Platform, StatusBar } from 'react-native';

const SearchBar = ({ searchQuery, setSearchQuery, searchResults, onResultPress }) => {

  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder="Search for stores"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        accessibilityLabel="Search for stores"
      />
      {searchResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.searchResultItem}
                onPress={() => onResultPress(item)}
                accessibilityLabel={`Select ${item.title}`}
              >
                <Text style={styles.searchResultText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default SearchBar;
