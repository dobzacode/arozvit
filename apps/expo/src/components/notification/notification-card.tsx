import { MotiView } from "moti/build";
import { Skeleton } from "moti/skeleton";
import { useEffect } from "react";
import { Text, View, useColorScheme } from "react-native";

import type { Notification, NotificationPlant } from "@planty/validators";

import { api } from "~/utils/api";

export default function NotificationCard({
  notification,
  index = 1,
}: {
  notification: Notification & { notificationPlant: NotificationPlant[] };
  index?: number;
}) {
  const translateX = index % 2 === 0 ? -100 : 100;

  const colorScheme = useColorScheme();

  const plantQueries = api.useQueries((t) =>
    notification.notificationPlant.map((notificationPlant) => {
      return t.plant.isWatered(notificationPlant.plantId, {
        enabled: !notification.isRead,
      });
    }),
  );

  const { mutate } = api.notification.markAsRead.useMutation();

  useEffect(() => {
    if (notification.isRead || plantQueries.some((query) => query.isLoading))
      return;
    if (
      plantQueries.every((query) => !query.isLoading) &&
      plantQueries.every((query) => query.data)
    ) {
      mutate(notification.id);
    }
  }, [plantQueries.some((query) => query.isLoading)]);

  return (
    <Skeleton show={plantQueries.some((query) => query.isLoading)} colorMode={colorScheme === "dark" ? "dark" : "light"}>
      <MotiView
        from={{ translateX, opacity: 0 }}
        animate={{ translateX: 0, opacity: 1 }}
        transition={{ damping: 300 }}
        exit={{ translateX, opacity: 0 }}
        delay={index * 100}
        needsOffscreenAlphaCompositing
      >
        <View
          className={`card-neutral mx-md my-xs flex-row items-center justify-between p-sm`}
        >
          <Text
            numberOfLines={1}
            className="body text-surface-fg dark:text-surface"
          >
            {notification.content}
          </Text>
          <Text
            numberOfLines={1}
            className="body text-surface-fg dark:text-surface"
          >
            {new Date(notification.createdAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>
      </MotiView>
    </Skeleton>
  );
}
