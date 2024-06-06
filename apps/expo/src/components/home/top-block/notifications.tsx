import { Pressable, Text, View } from "react-native";

import type { Plant } from "@planty/validators";

import { firstLetterCapitalize } from "~/utils/utils";

export default function Notifications({ plants }: { plants: Plant[] }) {
  const plantToWater = plants.reduce((planteMax, plante) => {
    return plante.nextWatering > planteMax.nextWatering ? plante : planteMax;
  });

  return (
    <View className="surface w-7xl gap-sm rounded-sm p-sm shadow-md">
      <Text className="heading-h4 text-surface-fg dark:text-surface">
        Notification
      </Text>

      <Text className="body">
        {firstLetterCapitalize(plantToWater.name)} nécessite un arrosage depuis
        le {plantToWater.nextWatering.toLocaleDateString()}
      </Text>
      <Pressable className="mt-sm items-center justify-center rounded-xs  bg-info py-xs shadow-sm shadow-black">
        <Text className="button-txt text-info-fg">Marquer comme arrosé</Text>
      </Pressable>
    </View>
  );
}
