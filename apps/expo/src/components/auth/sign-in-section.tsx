import { Text, useColorScheme, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

import SignInWithOAuth from "./sign-in-with-oauth";

export default function SignInSection() {
  const colorScheme = useColorScheme();
  return (
    <View className="w-full gap-md px-md">
      <SignInWithOAuth role="link" strategy="apple" testID="apple-oauth-button">
        <AntDesign
          name="apple1"
          size={20}
          color={colorScheme === "dark" ? "white" : "black"}
        />
        <Text className="button-txt text-center text-surface-fg dark:text-surface">
          Continuer avec Apple
        </Text>
      </SignInWithOAuth>
      <SignInWithOAuth
        role="link"
        strategy="facebook"
        testID="facebook-oauth-button"
      >
        <AntDesign
          name="facebook-square"
          size={20}
          color={colorScheme === "dark" ? "white" : "black"}
        />
        <Text className="button-txt text-center text-surface-fg dark:text-surface">
          Continuer avec Facebook
        </Text>
      </SignInWithOAuth>
      <SignInWithOAuth
        role="link"
        strategy="google"
        testID="google-oauth-button"
      >
        <AntDesign
          name="google"
          size={20}
          color={colorScheme === "dark" ? "white" : "black"}
        />
        <Text className="button-txt text-center text-surface-fg dark:text-surface">
          Continuer avec Google
        </Text>
      </SignInWithOAuth>
    </View>
  );
}
