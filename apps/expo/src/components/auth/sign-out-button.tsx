import { Pressable, Text, useColorScheme, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Skeleton } from "moti/skeleton";

export const SignOutButton = () => {
  const colorScheme = useColorScheme();

  const { isLoaded, signOut } = useAuth();

  return (
    <Skeleton
      show={!isLoaded}
      colorMode={colorScheme === "dark" ? "dark" : "light"}
    >
      <Pressable
        onPress={async () => await signOut()}
        className="card-neutral flex-row items-center justify-between px-md py-smd shadow-sm shadow-black"
      >
        <View className="flex-row gap-md">
          <Ionicons
            className="relative z-30 p-md"
            name="exit-outline"
            style={{
              color: colorScheme === "light" ? "black" : "white",
            }}
            size={20}
          />
          <Text className="body text-surface-fg dark:text-surface">
            Se déconnecter
          </Text>
        </View>
      </Pressable>
    </Skeleton>
  );
};
