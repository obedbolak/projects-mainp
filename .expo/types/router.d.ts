/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(Cart)` | `/(Cart)/Cart` | `/(Cart)/Check` | `/(Settings)` | `/(Settings)/ManageProducts` | `/(Settings)/Settings` | `/(tabs)` | `/(tabs)/(Cart)` | `/(tabs)/(Cart)/Cart` | `/(tabs)/(Cart)/Check` | `/(tabs)/(Settings)` | `/(tabs)/(Settings)/ManageProducts` | `/(tabs)/(Settings)/Settings` | `/(tabs)/Cart` | `/(tabs)/Check` | `/(tabs)/ManageProducts` | `/(tabs)/Profile` | `/(tabs)/Settings` | `/(tabs)/home` | `/Cart` | `/Check` | `/ManageProducts` | `/Merchant/CreateProduct` | `/Merchant/MyProductList` | `/Profile` | `/Settings` | `/_sitemap` | `/auth` | `/auth/ForgotPassword` | `/auth/SignIn` | `/auth/SignUp` | `/components/Carousel` | `/components/CustomButton` | `/components/EmailField` | `/components/NameField` | `/components/PasswordField` | `/home` | `/homeComponents/Chat` | `/homeComponents/Hearder` | `/homeComponents/NewArivals` | `/homeComponents/ProductList` | `/homeComponents/TopRankings` | `/homeComponents/listSections` | `/onboarding` | `/onboarding/` | `/onboarding/Welcome` | `/search/ProductSearch`;
      DynamicRoutes: `/Product/${Router.SingleRoutePart<T>}` | `/lostItem/${Router.SingleRoutePart<T>}` | `/sellersList/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/Product/[id]` | `/lostItem/[id]` | `/sellersList/[id]`;
    }
  }
}
