// babel.config.js

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Ensure you're using the correct preset
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      'react-native-reanimated/plugin', // Must be last in the plugins array
    ],
  };
};
