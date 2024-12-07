import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface Image {
  public_id: string;
  url: string;
  _id: string;
}
interface CartItem {
  _id: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  images: Image[];
  createdAt: string;
}

interface CartState {
  userId: string; // Unique identifier for the current user

  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  userId: "", // Initialize with an empty string or fetch the user ID from your auth system

  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload; // Set the current user's ID
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.name + item.createdAt === newItem.id
      );
      if (existingItem) {
        // existingItem.quantity += newItem.quantity; // Add quantity here
        console.log("item already exist here");
      } else {
        state.items.push({ ...newItem, quantity: newItem.quantity }); // Set quantity
      }
      state.total += newItem.price * newItem.quantity; // Update total
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        state.total -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter((item) => item.id !== id);
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        state.total += (quantity - item.quantity) * item.price;
        item.quantity = quantity;
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity, setUserId } =
  cartSlice.actions;
export default cartSlice.reducer;
