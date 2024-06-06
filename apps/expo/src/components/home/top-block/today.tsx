import { Pressable, Text, View } from "react-native";

import type { Plant } from "@planty/validators";

export default function Today({ plants }: { plants: Plant[] }) {
  return (
    <View className="surface max-h-fit w-7xl gap-sm self-start rounded-sm p-sm shadow-md">
      <Text className="heading-h4 text-surface-fg dark:text-surface">
        Aujourd'hui
      </Text>

      <Text className="body">
        {plants.length} {plants.length > 1 ? "plantes" : "plante"} ont un
        arrosage prévu pour aujourd'hui
      </Text>
      <Pressable className="mt-sm items-center justify-center rounded-xs bg-secondary py-xs shadow-sm shadow-black">
        <Text className="button-txt text-secondary-fg">
          Accéder à ces plantes
        </Text>
      </Pressable>
    </View>
  );
}
