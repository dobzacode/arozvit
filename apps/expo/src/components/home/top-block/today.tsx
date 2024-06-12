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
    <View
      testID="today-component"
      className="card-neutral gap-sm self-start rounded-sm p-sm shadow-black"
    >
      <Text className="heading-h4 text-surface-fg dark:text-surface">
        Aujourd'hui
      </Text>

      <Text className="body w-7xl text-surface-fg dark:text-surface">
        {plants.length} {plants.length > 1 ? "plantes ont" : "plante a"} un
        arrosage prévu pour aujourd'hui
      </Text>
      <Pressable className=" items-center justify-center rounded-xs bg-secondary px-md py-sm shadow-sm shadow-black">
        <Text className="button-txt whitespace-nowrap text-secondary-fg">
          Accéder à {plants.length > 1 ? "ces plantes" : "cette plante"}
        </Text>
      </Pressable>
    </View>
  );
}
