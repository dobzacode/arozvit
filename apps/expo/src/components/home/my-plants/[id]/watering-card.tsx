import moment from "moment-timezone";
import { useState } from "react";
import { ActivityIndicator, Text, useColorScheme, View } from "react-native";

import type { Plant } from "@arozvit/validators";

import WateringButton from "~/components/ui/watering-button";

export default function WateringCard({ plant }: { plant: Plant }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const colorScheme = useColorScheme();

  return (
    <View className="card-neutral w-full gap-xs self-start p-sm shadow-sm shadow-black">
      {isLoading && (
        <ActivityIndicator
          testID="loading-indicator"
          className="absolute right-sm top-sm"
          color={colorScheme === "dark" ? "white" : "black"}
        ></ActivityIndicator>
      )}
      <Text className="heading-h3  text-surface-fg dark:text-surface">
        Arrosage
      </Text>
      <View className="gap-xxs pb-smd">
        <Text className="body body text-surface-fg dark:text-surface">
          Dernier arrosage : {moment(plant.lastWatering).format("DD/MM/YYYY")}
        </Text>
        <Text className="body body text-surface-fg dark:text-surface">
          Prochain arrosage : {moment(plant.nextWatering).format("DD/MM/YYYY")}
        </Text>
        <Text className="body body text-surface-fg dark:text-surface">
          Fréquence d'arrosage : tous les {plant.dayBetweenWatering}{" "}
          {plant.wateringInterval}
        </Text>
      </View>
      <WateringButton setIsLoading={setIsLoading} plant={plant} />
    </View>
  );
}
