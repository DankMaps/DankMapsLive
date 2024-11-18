// src/utils/constants.js

import { Dimensions } from 'react-native';

export const PROVINCE_REGIONS = {
  Gauteng: {
    latitude: -25.746111,
    longitude: 28.188056,
    latitudeDelta: 1.0,
    longitudeDelta: 1.0,
  },
  'KwaZulu-Natal': {
    latitude: -29.858680,
    longitude: 31.021840,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  },
  'Cape Town': {
    latitude: -33.924870,
    longitude: 18.424055,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  },
};

export const PROVINCES = ['Gauteng', 'KwaZulu-Natal', 'Cape Town'];

export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const COLLAPSED_HEIGHT = SCREEN_HEIGHT * 0.4;
export const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.8;
