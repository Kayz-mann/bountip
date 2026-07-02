import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import { favouritesReducer } from '@/store/favourites-slice';
import { filtersReducer } from '@/store/filters-slice';

// Only favourites are persisted; filters intentionally reset each session.
const favouritesPersistConfig = {
  key: 'favourites',
  storage: AsyncStorage,
  whitelist: ['ids'],
};

const rootReducer = combineReducers({
  filters: filtersReducer,
  favourites: persistReducer(favouritesPersistConfig, favouritesReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
