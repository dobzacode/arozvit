import { Appearance, Image, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

export default function TopMenu() {
  const { user, isLoaded } = useUser();
  const { colorScheme } = useColorScheme();

  if (!isLoaded) {
    return null;
  }

  return (
    <View className="flex w-full flex-row items-center justify-between bg-transparent p-md">
      <Image
        className="rounded-full"
        style={{ width: 24, height: 24 }}
        source={
          //eslint-disable-next-line
          user?.imageUrl
            ? {
                uri: user.imageUrl,
              }
            : require("./../../assets/placeholder-user.jpg")
        }
      ></Image>
      <Feather
        onPress={() =>
          Appearance.setColorScheme(colorScheme === "light" ? "dark" : "light")
        }
        name={colorScheme === "light" ? "sun" : "moon"}
        size={20}
        color="black"
      />
    </View>
  );
}
