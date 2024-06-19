import { Appearance, Switch, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function DarkModeSection({
  colorScheme,
}: {
  colorScheme?: string | null;
}) {
  return (
    <View className="gap-sm">
      <Text className="heading-h3   font-['mustica-pro-medium'] font-medium text-surface-fg dark:text-surface">
        Apparence
      </Text>
      <View className="card-neutral flex-row items-center justify-between px-md shadow-sm shadow-black">
        <View className="flex-row gap-md">
          <Feather
            className="relative z-30 p-md"
            style={{
              color: colorScheme === "light" ? "black" : "white",
            }}
            name={colorScheme === "light" ? "sun" : "moon"}
            size={20}
          />
          <Text className="body text-surface-fg dark:text-surface">
            Mode sombre
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "hsl(100, 36%, 55%)" }}
          thumbColor={colorScheme !== "dark" ? "white" : "white"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() =>
            Appearance.setColorScheme(
              colorScheme === "light" ? "dark" : "light",
            )
          }
          value={colorScheme === "dark"}
        />
      </View>
    </View>
  );
}
