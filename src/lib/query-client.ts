import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';

/**
 * Single QueryClient for the app. The catalogue is near-static, so we keep data
 * fresh for 5 minutes and cached for 10 to avoid needless refetches.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

/** Persists the query cache to AsyncStorage so the catalogue is readable offline. */
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000,
});

/** Bumped when the cached shape changes, to discard incompatible persisted data. */
export const PERSIST_BUSTER = 'v1';
export const PERSIST_MAX_AGE = 24 * 60 * 60 * 1000; // 24h
