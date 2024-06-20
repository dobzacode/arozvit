import type { Notification, NotificationPlant } from "@arozvit/validators";
import { useEffect, useState } from "react";
import { Pressable, Text, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { MotiView } from "moti/build";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";

export default function NotificationCard({
  notification,
  index = 1,
}: {
  notification: Notification & { notificationPlant: NotificationPlant[] };
  index?: number;
}) {
  const translateX = index % 2 === 0 ? -100 : 100;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const colorScheme = useColorScheme();

  const router = useRouter();

  const utils = api.useUtils();

  const plantQueries = api.useQueries((t) =>
    notification.notificationPlant.map((notificationPlant) => {
      return t.plant.isWatered(notificationPlant.plantId, {
        enabled: !notification.isRead,
      });
    }),
  );

  const { mutate } = api.notification.markAsRead.useMutation({
    onSuccess: async () => {
      notification.isRead = true;
      await utils.notification.isAnyUnread.invalidate();
    },
  });

  useEffect(() => {
    if (notification.isRead || plantQueries.some((query) => query.isLoading))
      return;
    if (
      plantQueries.every((query) => !query.isLoading) &&
      plantQueries.every((query) => query.data)
    ) {
      mutate(notification.id);
    }
    setIsLoading(false);
  }, [plantQueries.some((query) => query.isLoading)]);

  console.log(notification.notificationPlant[0]?.plantId);

  return (
    <MotiView
      from={{ translateX, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      transition={{ damping: 300 }}
      exit={{ translateX, opacity: 0 }}
      delay={index * 100}
      needsOffscreenAlphaCompositing
    >
      <Skeleton
        show={isLoading}
        colorMode={colorScheme === "dark" ? "dark" : "light"}
      >
        <Pressable
          disabled={isLoading || notification.isRead}
          onPress={() => {
            router.push(
              notification.notificationPlant.length > 1
                ? `/myplants?isFiltered=true`
                : `/myplants/${notification.notificationPlant[0]?.plantId}`,
            );
          }}
          className={`card-neutral  flex-row items-center justify-between p-sm ${notification.isRead && "opacity-40 shadow-none"}`}
        >
          <Text
            numberOfLines={2}
            className="body w-1/2 text-surface-fg dark:text-surface"
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
          {notification.isRead && (
            <AntDesign name="check" size={20} color="green" />
          )}
        </Pressable>
      </Skeleton>
    </MotiView>
  );
}
