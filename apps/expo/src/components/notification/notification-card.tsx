import { Text, View } from "react-native";
import { MotiView } from "moti/build";

import type { Notification } from "@planty/validators";

export default function NotificationCard({
  notification,
  index = 1,
}: {
  notification: Notification;
  index?: number;
}) {
  const translateX = index % 2 === 0 ? -100 : 100;

  console.log(notification.content);

  return (
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
  );
}
