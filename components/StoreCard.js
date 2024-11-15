// src/components/StoreCard.js

import React from 'react';
import {
  View,
  StyleSheet,
  Image, // Ensure Image is imported
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Chip,
  useTheme,
  IconButton,
  Button,
} from 'react-native-paper';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const StoreCard = ({
  item,
  isFavorite,
  toggleFavorite,
  getCategoryIcon,
  onCategoryPress,
  onVisitStore, // Prop for navigation
}) => {
  const theme = useTheme();

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      elevation={4}
    >
      <View style={styles.cardContent}>
        {/* Logo Container for Modern Look */}
        <View style={styles.logoContainer}>
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

          {/* Visit Store Button */}
          <Button
            mode="contained"
            onPress={onVisitStore}
            style={styles.visitButton}
            contentStyle={styles.visitButtonContent}
            labelStyle={styles.visitButtonLabel}
            icon={() => (
              <MaterialIcons
                name="store"
                size={20}
                color="#fff"
                style={{ marginRight: 5 }}
              />
            )}
            accessibilityLabel="Visit Store"
          >
            Visit Store
          </Button>
        </View>

        <View style={styles.actionIcons}>
          <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            color={isFavorite ? theme.colors.error : theme.colors.onSurface}
            size={20}
            onPress={toggleFavorite}
            accessibilityLabel="Favorite"
          />
        </View>
      </View>

      {/* Removed Share Button */}
      {/* If you have any additional layout adjustments, make them here */}
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
  visitButton: {
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: '#2e7d32',
  },
  visitButtonContent: {
    height: 40,
  },
  visitButtonLabel: {
    fontSize: 14,
    color: '#fff',
  },
  actionIcons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  // Removed shareButtonContainer and related styles
});

export default StoreCard;
