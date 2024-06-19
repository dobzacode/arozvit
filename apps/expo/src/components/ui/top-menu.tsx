import { Image, Pressable } from "react-native";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

export default function TopMenu({ className }: { className?: string }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  return (
    <Pressable
      onPress={() => {
        router.push("/settings");
      }}
      className={`absolute top-0 z-30 flex w-full flex-row items-center justify-between bg-transparent p-md ${className}
      `}
    >
      <Image
        testID="user-image"
        className="rounded-full p-md"
        style={{ width: 24, height: 24 }}
        alt={user?.imageUrl ? "User image" : "Placeholder user image"}
        source={
          //eslint-disable-next-line
          user?.imageUrl
            ? {
                uri: user.imageUrl,
              }
            : require("./../../../assets/placeholder-user.jpg")
        }
      ></Image>
    </Pressable>
  );
}
