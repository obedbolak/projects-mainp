import {
  Text,
  FlatList,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import {
  useCreateOrderMutation,
  useCreatePaymentIntentMutation,
} from "@/redux/apiSlice";
import { useStripe } from "@stripe/stripe-react-native";
import { RootState } from "@/redux/store";
import { useAuth } from "@/context/AuthContext";

const ShoppingCart = () => {
  const { userProfile } = useAuth();
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, // Return the new total
    0 // Initial value for the total
  );
  const [createOrder, { data, error, isLoading }] = useCreateOrderMutation();

  const [createPaymentIntent] = useCreatePaymentIntentMutation();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const user = userProfile;

  const onCheckout = async () => {
    // 1. Create a payment intent
    const response = await createPaymentIntent({
      amount: Math.floor(totalAmount * 100),
      currency: "usd",
      customerDetails: {
        name: `${user?.name}`,
        email: `${user?.email}`,
        phone: "123-456-7890",
      },
      shippingAddress: {
        name: "John Doe",
        line1: "123 Main St",
        line2: "Apt 4B",
        city: "Anytown",
        state: "CA",
        postal_code: "12345",
        country: "US",
      },
      billingDetails: {
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        line1: "123 Main St",
        line2: "Apt 4B",
        city: "Anytown",
        state: "CA",
        postal_code: "12345",
        country: "US",
      },
    });
    if (response.error) {
      Alert.alert("Something went wrong");
      return;
    }

    // 2. Initialize the Payment sheet
    const initResponse = await initPaymentSheet({
      merchantDisplayName: "unicomTeam.store",
      paymentIntentClientSecret: response.data.paymentIntent,
    });
    if (initResponse.error) {
      console.log(initResponse.error);
      Alert.alert("Something went wrong");
      return;
    }

    // 3. Present the Payment Sheet from Stripe
    const paymentResponse = await presentPaymentSheet();

    if (paymentResponse.error) {
      Alert.alert(
        `Error code: ${paymentResponse.error.code}`,
        paymentResponse.error.message
      );
      return;
    }

    // 4. If payment ok -> create the order
    // onCreateOrder();
  };

  // const onCreateOrder = async () => {
  //   const result = await createOrder({
  //     items: cartItems,
  //     subtotal,
  //     deliveryFee,
  //     total,
  //     customer: {
  //       name: 'Vadim',
  //       address: 'My home',
  //       email: 'vadim@notjust.dev',
  //     },
  //   });

  //   if (result.data?.status === 'OK') {
  //     Alert.alert(
  //       'Order has been submitted',
  //       `Your order reference is: ${result.data.data.ref}`
  //     );
  //     dispatch(cartSlice.actions.clear());
  //   }
  // };

  return (
    <>
      <Pressable
        onPress={onCheckout}
        className="absolute bg-black bottom-8 w-11/12 self-center p-5 rounded-full items-center"
      >
        <Text className="text-white font-medium text-base">
          Checkout
          {isLoading && <ActivityIndicator />}
        </Text>
      </Pressable>
    </>
  );
};

export default ShoppingCart;
