// src/components/CustomMap.js

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Image, Platform, Linking, Alert } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { getRegionForCoordinates } from '../utils/helpers';

const CustomMap = ({
  mapRegion,
  setMapRegion,
  storeData,
  useMarijuanaIcon,
  onMarkerPress,
  userLocation,
}) => {
  const mapRef = useRef(null);

  // Function to center the map on user location
  const centerMapOnUserLocation = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  // Effect to center map when userLocation changes
  useEffect(() => {
    centerMapOnUserLocation();
  }, [userLocation]);

  // Function to get category icon
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
    <MapView
      ref={mapRef}
      style={styles.map}
      region={mapRegion}
      showsUserLocation={true}
      onRegionChangeComplete={setMapRegion}
    >
      {storeData.map((store) => (
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
                : store.logo
                ? typeof store.logo === 'string'
                  ? { uri: store.logo }
                  : store.logo
                : require('../assets/default-logo.png') // Default image
            }
            style={styles.markerImage}
            accessibilityLabel={`${store.title} Marker`}
          />
        </Marker>
      ))}
    </MapView>
  );
};

CustomMap.propTypes = {
  mapRegion: PropTypes.object.isRequired,
  setMapRegion: PropTypes.func.isRequired,
  storeData: PropTypes.array.isRequired,
  useMarijuanaIcon: PropTypes.bool.isRequired,
  onMarkerPress: PropTypes.func.isRequired,
  userLocation: PropTypes.object,
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default CustomMap;
