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

      <Pressable
        onPress={() => {
          Appearance.setColorScheme(colorScheme === "light" ? "dark" : "light");
        }}
        testID={`${colorScheme}-icon`}
      >
        <Feather
          className="relative z-30 p-md"
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
