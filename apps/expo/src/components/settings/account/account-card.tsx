import { Image, Pressable, Text, useColorScheme, View } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";

export default function AccountCard() {
  const colorScheme = useColorScheme();

  const { data, isLoading } = api.user.get.useQuery();

  return (
    <Skeleton
      show={isLoading}
      colorMode={colorScheme === "dark" ? "dark" : "light"}
    >
      {data ? (
        <View className="card-neutral flex-row items-center justify-between gap-sm ">
          <View className="flex-row items-center gap-lg">
            <Image
              testID="user-image"
              className="rounded-l-sm p-md"
              style={{ width: 52, height: 52 }}
              alt={data[0]?.imageUrl ? "User image" : "Placeholder user image"}
              source={
                //eslint-disable-next-line
                data[0]?.imageUrl
                  ? {
                      uri: data[0]?.imageUrl,
                    }
                  : require("./../../../assets/placeholder-user.jpg")
              }
            ></Image>
            <View className=" flex-col justify-center ">
              <Text
                numberOfLines={1}
                className="body w-[140] text-surface-fg dark:text-surface"
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
          </View>

          <Pressable
            className="p-md"
            onPress={() => router.push("/settings/edit")}
          >
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
      ) : null}
    </Skeleton>
  );
}
