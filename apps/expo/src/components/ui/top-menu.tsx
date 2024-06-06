import { Appearance, Image, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

export default function TopMenu({ className }: { className?: string }) {
  const { user, isLoaded } = useUser();
  const { colorScheme } = useColorScheme();

  if (!isLoaded) {
    return null;
  }

  return (
    <View
      className={`absolute top-0 flex w-full flex-row items-center justify-between bg-transparent p-md ${className}`}
    >
      <Image
        className="rounded-full p-xs"
        style={{ width: 24, height: 24 }}
        source={
          //eslint-disable-next-line
          user?.imageUrl
            ? {
                uri: user.imageUrl,
              }
            : require("./../../../assets/placeholder-user.jpg")
        }
      ></Image>

      <Feather
        className="p-xs"
        onPress={() =>
          Appearance.setColorScheme(colorScheme === "light" ? "dark" : "light")
        }
        style={{
          color: colorScheme === "light" ? "black" : "white",
        }}
        name={colorScheme === "light" ? "sun" : "moon"}
        size={20}
      />
    </View>
  );
}
