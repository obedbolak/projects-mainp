// store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartslice";
import favoritesReducer from "./favouriteslice";
import { apiSlice } from "./apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query/react";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer, // Add it to the store
    [apiSlice.reducerPath]: apiSlice.reducer, // Use computed property name
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
