// Test environment setup. The jest-expo preset mocks most Expo/React Native
// native modules; app-specific mocks live here.

// Official AsyncStorage jest mock — backs redux-persist and the react-query persister.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
