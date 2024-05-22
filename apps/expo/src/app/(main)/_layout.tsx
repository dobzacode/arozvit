import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, Slot } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function RootLayout() {
  const auth = useAuth();

  const colorScheme = useColorScheme();

  if (!auth.isLoaded) {
    return null;
  }

  if (!auth.isSignedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: colorScheme == "dark" ? "#242e1f" : "#d7e0d1",
      }}
    >
      <Slot />
    </SafeAreaView>
  );
}
