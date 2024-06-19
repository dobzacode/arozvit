import { Pressable } from "react-native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

export default function GoBackButton({ path }: { path: string }) {
  const { colorScheme } = useColorScheme();

  return (
    <Pressable
      role="button"
      onPress={() => router.push(path)}
      className="card-neutral dark:bg-sr absolute bottom-md left-md items-center justify-center rounded-xs p-sm shadow-sm shadow-black"
    >
      <AntDesign
        name="left"
        size={24}
        color={colorScheme === "light" ? "black" : "white"}
      />
    </Pressable>
  );
}
