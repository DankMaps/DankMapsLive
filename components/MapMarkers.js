// src/components/MapMarkers.js

import React from 'react';
import { Marker } from 'react-native-maps';
import { Image, StyleSheet } from 'react-native';

const MapMarkers = ({ storeData, useMarijuanaIcon, onMarkerPress }) => {
  return (
    <>
      {storeData && storeData.map((store) => (
        <Marker
          key={store.id}
          coordinate={{
            latitude: store.latitude,
            longitude: store.longitude,
          }}
          onPress={() => onMarkerPress(store)}
          anchor={{ x: 0.5, y: 1 }}
          calloutEnabled={false}
        >
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
    </>
  );
};

const styles = StyleSheet.create({
  markerImage: {
    width: 40, // Reduced size for a more modern look
    height: 40, // Reduced size for a more modern look
    borderRadius: 20,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default MapMarkers;
