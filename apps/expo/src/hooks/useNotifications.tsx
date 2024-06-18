import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useAuth } from "@clerk/clerk-expo";

import { api } from "~/utils/api";

Notifications.setNotificationHandler({
  // eslint-disable-next-line
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function useNotification() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    [],
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const { isLoaded, userId } = useAuth();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const { mutate } = api.expoPushToken.addExpoPushToken.useMutation({});
  const { data, isLoading } =
    api.expoPushToken.getUserExpoPushTokens.useQuery();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          setExpoPushToken(token as string);
        }
      })
      .catch((error) => console.error(error));

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync()
        .then((channels) => setChannels(channels))
        .catch((error) => console.error(error));
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (isLoaded && userId && expoPushToken && !isLoading) {
      console.log(data?.length === 0);
      //eslint-disable-next-line
      data?.some((token) => token.token !== expoPushToken) || data?.length === 0
        ? mutate(expoPushToken)
        : null;
    }
  }, [isLoaded, userId, expoPushToken, mutate, isLoading]);

  return { expoPushToken, notification, channels };
}

async function registerForPushNotificationsAsync() {
  let token: unknown;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    // eslint-disable-next-line
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    // eslint-disable-next-line
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId: unknown =
        // eslint-disable-next-line
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: projectId as string,
        })
      ).data;
      console.log(token);
    } catch (e: unknown) {
      token = `${e?.toString()}`;
    }
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  return token;
}
