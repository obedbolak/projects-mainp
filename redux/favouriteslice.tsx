import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Image {
  public_id: string;
  url: string;
  _id: string;
}

interface FavoriteItem {
  _id: string; // Unique identifier for the item
  id: string;
  name: string;
  price: number;
  description: string;
  images: Image[];
}

interface FavoritesState {
  [userId: string]: FavoriteItem[]; // Map user IDs to their favorite items
}

const initialState: FavoritesState = {};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (
      state,
      action: PayloadAction<{ userId: string; item: FavoriteItem }>
    ) => {
      const { userId, item } = action.payload;

      if (!state[userId]) {
        state[userId] = []; // Initialize array if it doesn't exist
      }
      const existingItem = state[userId].find((fav) => fav.id === item.id);
      if (!existingItem) {
        state[userId].push(item); // Add new item to user's favorites
      }
    },
    removeFavorite: (
      state,
      action: PayloadAction<{ userId: string; itemId: string }>
    ) => {
      const { userId, itemId } = action.payload;

      if (state[userId]) {
        state[userId] = state[userId].filter((item) => item.id !== itemId); // Remove item from user's favorites
      }
    },
    clearFavorites: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      delete state[userId]; // Clear favorites for the user
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
