import { Pressable, Text, View } from "react-native";

import type { Plant } from "@planty/validators";

export default function Today({ plants }: { plants?: Plant[] }) {
  if (
    !plants ||
    plants.filter(
      (plant) =>
        plant.nextWatering.toLocaleDateString() ===
        new Date().toLocaleDateString(),
    ).length === 0
  ) {
    return null;
  }

  return (
    <View className="card-neutral w-7xl gap-sm self-start rounded-sm p-sm shadow-md">
      <Text className="heading-h4 text-surface-fg dark:text-surface">
        Aujourd'hui
      </Text>

      <Text className="body text-surface-fg dark:text-surface">
        {plants.length} {plants.length > 1 ? "plantes ont" : "plante a"} un
        arrosage prévu pour aujourd'hui
      </Text>
      <Pressable className="mt-sm items-center justify-center rounded-xs bg-secondary py-xs shadow-sm shadow-black">
        <Text className="button-txt text-secondary-fg">
          Accéder à {plants.length > 1 ? "ces plantes" : "cette plante"}
        </Text>
      </Pressable>
    </View>
  );
}
