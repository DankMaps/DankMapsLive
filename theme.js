// theme.js

import { MD3LightTheme as PaperDefaultTheme, MD3DarkTheme as PaperDarkTheme } from 'react-native-paper';

export const lightTheme = {
    ...PaperDefaultTheme,
    colors: {
      ...PaperDefaultTheme.colors,
      primary: '#6200ee',
      background: '#ffffff',
      surface: '#ffffff',
      text: '#000000',
      onSurface: '#000000',
      onPrimary: '#ffffff',
    },
  };
  
  export const darkTheme = {
    ...PaperDarkTheme,
    colors: {
      ...PaperDarkTheme.colors,
      primary: '#bb86fc',
      background: '#000000',
      surface: '#121212',
      text: '#ffffff',
      onSurface: '#ffffff',
      onPrimary: '#000000',
    },
  };