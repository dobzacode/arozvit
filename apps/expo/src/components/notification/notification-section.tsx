import { useColorScheme, View } from "react-native";
import { AnimatePresence } from "moti/build";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";
import NotificationCard from "./notification-card";

export default function NotificationSection() {
  const colorScheme = useColorScheme();

  const { data, isLoading, isError } =
    api.notification.getUserNotifications.useQuery();

  if (isError) return null;

  return (
    <View className="flex h-full flex-col gap-sm px-md">
      {isLoading ? (
        [1, 2, 3, 4, 5].map((index) => (
          <Skeleton
            show={true}
            colorMode={colorScheme === "dark" ? "dark" : "light"}
            key={`${index}-skeleton-snippet`}
            height={60}
          >
            <View></View>
          </Skeleton>
        ))
      ) : (
        <AnimatePresence>
          {data
            ? data.map((notification, index) => (
                <NotificationCard
                  key={`notification-card-${notification.id}`}
                  index={index}
                  notification={notification}
                ></NotificationCard>
              ))
            : null}
        </AnimatePresence>
      )}
    </View>
  );
}
