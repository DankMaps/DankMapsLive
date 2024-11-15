// src/components/StoreCard.js

import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
  Linking, // Added import for Linking
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const StoreCard = ({
  item,
  isExpanded,
  toggleExpand,
  isFavorite,
  toggleFavorite,
  getCategoryIcon,
  onCategoryPress,
  onVisitStore, // New prop for navigation
}) => {
  const theme = useTheme();

  // Handler for Directions button
  const handleDirections = () => {
    // Ensure item has latitude and longitude
    const latitude = item.latitude;
    const longitude = item.longitude;

    if (latitude && longitude) {
      const url = Platform.select({
        ios: `maps:0,0?q=${latitude},${longitude}(${item.title})`,
        android: `geo:0,0?q=${latitude},${longitude}(${item.title})`,
      });

      Linking.openURL(url).catch(() =>
        Alert.alert('Error', 'Unable to open map for directions.')
      );
    } else {
      Alert.alert('Error', 'Location information is not available.');
    }
  };

  // Handler for Share button
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out ${item.title}! ${item.description}`,
        url: item.website || '', // Assuming you have a website field
        title: item.title,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share the store details.');
    }
  };

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={toggleExpand}
      elevation={4}
    >
      <View style={styles.cardContent}>
        {/* Logo Container for Modern Look */}
        <View style={styles.logoContainer}>
          {/* Update the Image source to use { uri: item.logo } */}
          {item.logo ? (
            <Image
              source={{ uri: item.logo }}
              style={styles.logo}
              resizeMode="cover"
              onError={(e) => {
                console.log('Image failed to load:', e.nativeEvent.error);
                // Optionally, set a state to display a fallback image
              }}
            />
          ) : (
            <Image
              source={require('../assets/default-logo.png')} // Local placeholder image
              style={styles.logo}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={styles.cardText}>
          <Title style={{ color: theme.colors.onSurface }}>{item.title}</Title>
          {isExpanded && (
            <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
              {item.description}
            </Paragraph>
          )}
          <View style={styles.chipContainer}>
            {item.categories.map((category) => (
              <Chip
                key={category}
                style={styles.chip}
                textStyle={{ fontSize: 10 }}
                icon={() => getCategoryIcon(category)}
                onPress={() => onCategoryPress(category)}
              >
                {category}
              </Chip>
            ))}
          </View>
        </View>
        <View style={styles.actionIcons}>
          <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            color={isFavorite ? theme.colors.error : theme.colors.secondary}
            size={20}
            onPress={toggleFavorite}
            accessibilityLabel="Favorite"
          />
        </View>
      </View>

      {/* Action Buttons */}
      {isExpanded && (
        <View style={styles.actionButtonsContainer}>
          {/* Directions Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDirections}
            accessibilityLabel="Directions"
          >
            <MaterialIcons
              name="directions"
              size={24}
              color={theme.colors.primary}
            />
            <Title style={styles.actionLabel}>Directions</Title>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            accessibilityLabel="Share"
          >
            <MaterialIcons
              name="share"
              size={24}
              color={theme.colors.primary}
            />
            <Title style={styles.actionLabel}>Share</Title>
          </TouchableOpacity>

          {/* Visit Store Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onVisitStore} // Invoke the navigation handler
            accessibilityLabel="Visit Store"
          >
            <MaterialIcons
              name="store"
              size={24}
              color={theme.colors.primary}
            />
            <Title style={styles.actionLabel}>Visit Store</Title>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,
    elevation: 10,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35, // Circular shape
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 5,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardText: {
    flex: 1,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 6,
    marginTop: 4,
    backgroundColor: '#e0e0e0',
  },
  actionIcons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    right: 10,
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
  actionLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#555',
  },
});

export default StoreCard;
