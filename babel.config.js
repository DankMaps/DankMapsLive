module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // or your relevant preset
    plugins: [
      'react-native-reanimated/plugin', // Add this line
    ],
  };
};