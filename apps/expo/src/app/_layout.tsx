import "@bacons/text-decoder/install";

import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";

import { tokenCache } from "~/utils/utils";

import "./../styles.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing Clerk Publishable Key");
  }

  const [fontsLoaded, fontError] = useFonts({
    //eslint-disable-next-line
    "space-grotesk": require("./../../assets/fonts/SpaceGrotesk-Bold.ttf"),
    //eslint-disable-next-line
    "mustica-pro": require("./../../assets/fonts/MusticaPro-Regular.ttf"),
    //eslint-disable-next-line
    "mustica-pro-medium": require("./../../assets/fonts/MusticaPro-Medium.ttf"),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {/* <TRPCProvider> */}
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        ></Stack>
      </SafeAreaProvider>
      <StatusBar
        backgroundColor={colorScheme === "dark" ? "#000000" : "#ffffff"}
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      ></StatusBar>
      {/* </TRPCProvider> */}
    </ClerkProvider>
  );
}
