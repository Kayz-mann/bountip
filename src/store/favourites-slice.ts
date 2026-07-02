import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';

export interface FavouritesState {
  ids: number[];
}

const initialState: FavouritesState = {
  ids: [],
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    toggleFavourite(state, action: PayloadAction<number>) {
      const index = state.ids.indexOf(action.payload);
      if (index >= 0) {
        state.ids.splice(index, 1);
      } else {
        state.ids.push(action.payload);
      }
    },
  },
});

export const { toggleFavourite } = favouritesSlice.actions;
export const favouritesReducer = favouritesSlice.reducer;

export const selectFavouriteIds = (state: RootState) => state.favourites.ids;
export const selectIsFavourite = (id: number) => (state: RootState) =>
  state.favourites.ids.includes(id);
