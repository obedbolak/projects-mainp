import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import { store } from "@/redux/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { StripeProvider } from "@stripe/stripe-react-native";

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack>
      <Stack.Screen
        name="sellersList/[id]"
        options={{
          headerTitle: "Sellers",
          headerTransparent: true, // Use this for a transparent background
        }}
      />
      <Stack.Screen
        name="lostItem/[id]"
        options={{
          headerTitle: "Lost items",
          headerTransparent: true, // Use this for a transparent background
        }}
      />

      <Stack.Screen name="Product/[id]" options={{ headerShown: false }} />
      {isAuthenticated ? (
        // Show the tab navigator when authenticated
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        // Show the auth screen when not authenticated
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      )}
    </Stack>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <StripeProvider
        publishableKey="pk_test_51MVgSgKix8j5hIGdHEEVTRTqLeNIKccM1NAypsCpyMkz8y7bkCHCGzmysGkQ3uv6ewR3qiBjEVfWISAsTBRVa5p200QpH2AEe2"
        merchantIdentifier="merchant.identifier" // required for Apple Pay
        urlScheme="your-url-scheme"
      >
        <ProductProvider>
          <AuthProvider>
            <Layout />
          </AuthProvider>
        </ProductProvider>
      </StripeProvider>
    </Provider>
  );
};

export default App;
