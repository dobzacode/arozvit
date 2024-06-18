import { Stack } from "expo-router";

import useNotification from "~/hooks/useNotifications";

export default function RootLayout() {
  const { expoPushToken } = useNotification();

  console.log(expoPushToken);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
