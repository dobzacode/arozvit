import { Image, Pressable, Text, useColorScheme, View } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";

export default function AccountCard() {
  const colorScheme = useColorScheme();

  const { data, isLoading } = api.user.get.useQuery();

  const { data: avatar, isLoading: isLoadingAvatar } =
    api.user.getImage.useQuery(void 0, {
      refetchInterval: 86400000,
      staleTime: 86400000,
    });

  return (
    <View className="card-neutral flex-row items-center justify-between gap-sm ">
      <View className="flex-row items-center gap-lg">
        <Skeleton
          show={isLoadingAvatar}
          colorMode={colorScheme === "dark" ? "dark" : "light"}
        >
          <Image
            testID="user-image"
            className="rounded-l-sm p-md"
            style={{ width: 52, height: 52 }}
            alt={avatar ? "User image" : "Placeholder user image"}
            source={
              //eslint-disable-next-line
              avatar
                ? {
                    uri: avatar.includes("clerk")
                      ? avatar
                      : `data:image/jpeg;base64,${avatar}`,
                  }
                : require("./../../../../assets/placeholder-user.jpg")
            }
          ></Image>
        </Skeleton>
        <View className=" flex-col items-center justify-center">
          <Skeleton
            show={isLoading}
            height={20}
            colorMode={colorScheme === "dark" ? "dark" : "light"}
          >
            {data && (
              <View className="flex items-center ">
                <Text
                  numberOfLines={1}
                  className="body -mt-1 w-[140] text-surface-fg dark:text-surface"
                >
                  {data[0]?.firstName} {data[0]?.lastName}
                </Text>

                {data[0]?.username && (
                  <Text
                    numberOfLines={1}
                    className="body-sm w-[140] text-surface-fg dark:text-surface"
                  >
                    {data[0]?.username}
                  </Text>
                )}
              </View>
            )}
          </Skeleton>
        </View>
      </View>

      <Pressable className="p-md" onPress={() => router.push("/settings/edit")}>
        <MaterialCommunityIcons
          name="pencil-outline"
          className="relative z-30 "
          style={{
            color: colorScheme === "light" ? "black" : "white",
          }}
          size={20}
        />
      </Pressable>
    </View>
  );
}
