import "@bacons/text-decoder/install";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";

import { TRPCProvider } from "~/utils/api";
import { tokenCache } from "~/utils/cache";

import "./../styles.css";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [isLoaded] = useFonts({
    //eslint-disable-next-line
    "space-grotesk": require("./../../assets/fonts/SpaceGrotesk-Bold.ttf"),
    //eslint-disable-next-line
    "mustica-pro": require("./../../assets/fonts/MusticaPro-Regular.ttf"),
    //eslint-disable-next-line
    "mustica-pro-medium": require("./../../assets/fonts/MusticaPro-Medium.ttf"),
  });

  if (!isLoaded) {
    return null;
  }

  return (
    <ClerkProvider
      //eslint-disable-next-line
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
      tokenCache={tokenCache}
    >
      <TRPCProvider>
        <TRPCProvider>
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                contentStyle: {
                  backgroundColor:
                    colorScheme == "dark" ? "#09090B" : "#FFFFFF",
                },
              }}
            />
          </SafeAreaProvider>
        </TRPCProvider>
      </TRPCProvider>
    </ClerkProvider>
  );
}
