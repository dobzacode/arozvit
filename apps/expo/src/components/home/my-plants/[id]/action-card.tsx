import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { router } from "expo-router";

import type { Plant } from "@planty/validators";

import DeleteButton from "~/components/ui/delete-button";

export default function ActionCard({ plant }: { plant: Plant }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const colorScheme = useColorScheme();

  return (
    <View className="card-neutral w-full gap-sm self-start p-sm shadow-sm shadow-black">
      {isLoading && (
        <ActivityIndicator
          testID="loading-indicator"
          className="absolute right-sm top-sm"
          color={colorScheme === "dark" ? "white" : "black"}
        ></ActivityIndicator>
      )}
      <Text className="heading-h3  text-surface-fg dark:text-surface">
        Actions et paramètres
      </Text>
      <Pressable
        onPress={() => router.push(`/myplants/${plant.id}/edit`)}
        className={`card-neutral relative z-20 items-center  whitespace-nowrap rounded-xs px-md py-sm  shadow-sm ${isLoading ? "shadow-white" : "shadow-black"}  `}
      >
        <Text className="button-txt text-surface-fg dark:text-surface">
          Modifier la plante
        </Text>
      </Pressable>
      <DeleteButton setIsLoading={setIsLoading} plant={plant} />
    </View>
  );
}
