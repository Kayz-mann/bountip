import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react-native';
import { type ReactElement, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { favouritesReducer, toggleFavourite, type FavouritesState } from '@/store/favourites-slice';
import { filtersReducer, setCategory, setSearch, type FiltersState } from '@/store/filters-slice';

interface PreloadedState {
  filters?: FiltersState;
  favourites?: FavouritesState;
}

/**
 * A store with the same slices as the app but without persistence, hydrated per
 * test via actions (which keeps the RTK types simple and honest).
 */
export function makeTestStore(preloadedState?: PreloadedState) {
  const store = configureStore({
    reducer: { filters: filtersReducer, favourites: favouritesReducer },
  });

  if (preloadedState?.filters?.search) {
    store.dispatch(setSearch(preloadedState.filters.search));
  }
  if (preloadedState?.filters?.activeCategory != null) {
    store.dispatch(setCategory(preloadedState.filters.activeCategory));
  }
  preloadedState?.favourites?.ids.forEach((id) => store.dispatch(toggleFavourite(id)));

  return store;
}

/** A query client that fails fast (no retries) so error paths resolve immediately. */
export function makeTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
}

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

interface Options extends Omit<RenderOptions, 'wrapper'> {
  store?: ReturnType<typeof makeTestStore>;
  queryClient?: QueryClient;
}

export async function renderWithProviders(
  ui: ReactElement,
  { store = makeTestStore(), queryClient = makeTestQueryClient(), ...options }: Options = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>{children}</SafeAreaProvider>
        </QueryClientProvider>
      </Provider>
    );
  }

  const result = await render(ui, { wrapper: Wrapper, ...options });
  return { store, queryClient, ...result };
}
