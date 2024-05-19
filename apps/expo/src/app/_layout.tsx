import "@bacons/text-decoder/install";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";

import SignInWithOAuth from "~/components/sign-in-with-oauth";
import { SignOut } from "~/components/sign-out";
import { TRPCProvider } from "~/utils/api";
import { tokenCache } from "~/utils/cache";

import "../styles.css";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ClerkProvider
      //eslint-disable-next-line
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
      tokenCache={tokenCache}
    >
      <TRPCProvider>
        {/*
            The Stack component displays the current page.
            It also allows you to configure your screens
          */}
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#f472b6",
            },
            contentStyle: {
              backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
            },
          }}
        />

        <TRPCProvider>
          <SafeAreaProvider>
            <SignedIn>
              <SignOut />
            </SignedIn>
            <SignedOut>
              <SignInWithOAuth />
            </SignedOut>
          </SafeAreaProvider>
        </TRPCProvider>
      </TRPCProvider>
    </ClerkProvider>
  );
}
