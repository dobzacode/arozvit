import { Image, Pressable, useColorScheme } from "react-native";
import { router } from "expo-router";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";

export default function TopMenu({ className }: { className?: string }) {
  const colorScheme = useColorScheme();

  const { data: avatar, isLoading: isLoadingAvatar } =
    api.user.getImage.useQuery(void 0, {
      refetchInterval: 86400000,
      staleTime: 86400000,
    });

  console.log(avatar);

  return (
    <Pressable
      onPress={() => {
        router.push("/settings");
      }}
      className={`absolute top-0 z-30 flex w-[48]  flex-row items-center justify-between bg-transparent p-md ${className}
        `}
    >
      <Skeleton
        show={isLoadingAvatar}
        colorMode={colorScheme === "dark" ? "dark" : "light"}
        radius={"round"}
      >
        <Image
          testID="user-image"
          className="rounded-full p-md"
          style={{ width: 24, height: 24 }}
          alt={avatar ? "User image" : "Placeholder user image"}
          source={
            //eslint-disable-next-line
            avatar
              ? {
                  uri: avatar,
                }
              : require("./../../../assets/placeholder-user.jpg")
          }
        ></Image>
      </Skeleton>
    </Pressable>
  );
}
