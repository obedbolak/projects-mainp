import { useEffect, createContext, useContext, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserId } from "@/redux/cartslice";

interface UserProfile {
  profilePic: { public_id: string; url: string };
  _id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  answer: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  signUp: (
    name: string,
    email: string,
    password: string,
    city: string,
    address: string,
    country: string,
    phone: string,
    answer: string
  ) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();
  const segments = useSegments();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await SecureStore.getItemAsync("authToken");

      // Allow access to the home page regardless of authentication
      if (segments[0] === "home") {
        return; // Skip any redirect if we're already on the home page
      }

      if (token) {
        const userData = await SecureStore.getItemAsync("userData");

        if (userData) {
          setIsAuthenticated(true);
          setUserProfile(JSON.parse(userData)); // Set user profile from secure storage
          dispatch(setUserId(JSON.parse(userData)._id)); // Dispatch user ID
        } else {
          try {
            const response = await axios.get(
              "https://preeminent-macaron-3cd7d6.netlify.app/.netlify/functions/api/v1/user/profile",
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (response.data.user) {
              await SecureStore.setItemAsync(
                "userData",
                JSON.stringify(response.data.user)
              );
              setUserProfile(response.data.user);
              dispatch(setUserId(response.data.user._id));
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error("Failed to fetch user data:", error);
          }
        }
      }
    };

    checkAuthStatus();
  }, [segments]); // Add segments as a dependency to detect route changes

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://16.16.151.246:8080/api/v1/user/login",
        {
          email,
          password,
        }
      );

      if (!response.data.token) {
        throw new Error("Invalid email or password");
      }

      const token = response.data.token;
      const userData = response.data.user; // Assuming user data is in the response

      await SecureStore.setItemAsync("authToken", token);
      await SecureStore.setItemAsync("userData", JSON.stringify(userData)); // Save user data

      setIsAuthenticated(true);
      setUserProfile(userData); // Set user profile state
      dispatch(setUserId(userData._id));
      router.replace("/(tabs)/home");
    } catch (error) {
      alert("Having issues signing in");
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("authToken"); // Remove the token
    await SecureStore.deleteItemAsync("userData"); // Remove user data
    setIsAuthenticated(false);
    setUserProfile(null); // Reset user profile state
    dispatch(setUserId("")); // Clear user ID on sign out

    router.replace("/auth/SignIn");
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    city: string,
    address: string,
    country: string,
    phone: string,
    answer: string
  ) => {
    try {
      const response = await axios.post(
        "http://16.16.151.246:8080/api/v1/user/register",
        {
          name,
          email,
          password,
          city,
          address,
          country,
          phone,
          answer,
        }
      );

      if (!response) {
        throw new Error("Registration failed");
      }

      router.push("/auth/SignIn");
    } catch (error) {
      console.error("Error during sign up:", error);
      alert("An error occurred during registration");
    }
  };

  useEffect(() => {
    const rootSegment = segments[0];

    if (!isAuthenticated && rootSegment !== "auth") {
      router.replace("/home");
    } else if (isAuthenticated && rootSegment === "") {
      router.replace("/home");
    }
  }, [isAuthenticated, segments, router]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userProfile, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
