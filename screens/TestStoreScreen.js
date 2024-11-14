// src/screens/TestStoreScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { fetchStores } from '../src/api';

const TestStoreScreen = () => {
  const [stores, setStores] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadStores = async () => {
    const fetchedStores = await fetchStores();
    setStores(fetchedStores);
  };

  useEffect(() => {
    loadStores();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStores();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Store List</Text>
      <FlatList
        data={stores}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.storeContainer}>
            <Image source={{ uri: item.logo }} style={styles.logo} />
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Categories: {item.categories ? item.categories.join(', ') : 'N/A'}</Text>
            <Text>Website: {item.website}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  storeContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TestStoreScreen;
