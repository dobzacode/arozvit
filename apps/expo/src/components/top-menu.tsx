import { Appearance, Image, Pressable, View } from "react-native";
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
      <Pressable className="h-xl w-xl items-center justify-center">
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
      </Pressable>
      <Pressable
        className="h-xl w-xl items-center justify-center"
        onPress={() =>
          Appearance.setColorScheme(colorScheme === "light" ? "dark" : "light")
        }
      >
        <Feather
          style={{
            color: colorScheme === "light" ? "black" : "white",
          }}
          name={colorScheme === "light" ? "sun" : "moon"}
          size={20}
        />
      </Pressable>
    </View>
  );
}
