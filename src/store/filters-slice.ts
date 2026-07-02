import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';

export interface FiltersState {
  search: string;
  /** null means "All categories". */
  activeCategory: string | null;
}

const initialState: FiltersState = {
  search: '',
  activeCategory: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setCategory(state, action: PayloadAction<string | null>) {
      state.activeCategory = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setSearch, setCategory, resetFilters } = filtersSlice.actions;
export const filtersReducer = filtersSlice.reducer;

export const selectSearch = (state: RootState) => state.filters.search;
export const selectActiveCategory = (state: RootState) => state.filters.activeCategory;
