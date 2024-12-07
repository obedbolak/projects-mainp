import React, { createContext, useReducer, useEffect, ReactNode } from "react";

// Define the types for the product data
interface Image {
  public_id: string;
  url: string;
  _id: string;
}

interface Review {
  name: string;
  rating: number;
  comment: string;
  user: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Product {
  map(arg0: (item: any) => React.JSX.Element): React.ReactNode;
  uid: any;
  id: string | string[];
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: Category;
  images: Image[];
  rating: number;
  numReviews: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the state interface
interface State {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// Define the action types
type Action =
  | { type: "FETCH_SUCCESS"; payload: Product[] }
  | { type: "FETCH_ERROR"; payload: string };

// Create the initial state
const initialState: State = {
  products: [],
  loading: true,
  error: null,
};

// Create the reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Create the context
const ProductContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

// Create the provider component
const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://preeminent-macaron-3cd7d6.netlify.app/.netlify/functions/api/v1/product/get-all"
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        dispatch({ type: "FETCH_SUCCESS", payload: data.products });
      } else {
        dispatch({ type: "FETCH_ERROR", payload: data.message });
      }
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: (error as Error).message });
    }
  };

  useEffect(() => {
    fetchProducts(); // Initial fetch

    const intervalId = setInterval(fetchProducts, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

export { ProductContext, ProductProvider };
