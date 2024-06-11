import { useState } from "react";
import { Text, View } from "react-native";

import type { Plant } from "@planty/validators";

import WateringButton from "~/components/ui/watering-button";
import { firstLetterCapitalize } from "~/utils/utils";

export default function Notifications({ plants }: { plants: Plant[] }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const plantToWater = plants.reduce((planteMax, plante) => {
    return plante.nextWatering > planteMax.nextWatering ? plante : planteMax;
  });

  if (plantToWater.nextWatering > new Date()) {
    return null;
  }

  return (
    <View
      testID={`${plantToWater.name}-notification`}
      className={`card-neutral  gap-sm rounded-sm p-sm shadow-md ${isLoading && "disable-opacity"}`}
    >
      <Text className="heading-h4 text-surface-fg dark:text-surface">
        Notification
      </Text>

      <Text className="body w-7xl text-surface-fg dark:text-surface">
        {firstLetterCapitalize(plantToWater.name)} nécessite un arrosage depuis
        le {plantToWater.nextWatering.toLocaleDateString()}
      </Text>
      <WateringButton plant={plantToWater} setIsLoading={setIsLoading} />
    </View>
  );
}
