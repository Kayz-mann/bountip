/// <reference types="jest" />
// Test environment setup. The jest-expo preset mocks most Expo/React Native
// native modules; app-specific mocks live here.

// Official AsyncStorage jest mock — backs redux-persist and the react-query persister.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// expo-image renders a native view; a plain View is enough for behavioural tests.
jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return { Image: View };
});

// Native-only side effects — no-op in the test environment.
jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(),
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));

// Default to "online"; individual tests can override this mock.
jest.mock('expo-network', () => ({
  useNetworkState: () => ({ isConnected: true, isInternetReachable: true, type: 'WIFI' }),
  getNetworkStateAsync: jest.fn(async () => ({ isConnected: true, isInternetReachable: true })),
}));
