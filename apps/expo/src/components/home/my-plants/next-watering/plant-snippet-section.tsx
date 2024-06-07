import { Text, useColorScheme, View } from "react-native";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";
import PlantCardSnippet from "./plant-card-snippet";

export default function PlantSnippetSection({ date }: { date: string }) {
  const { data, isLoading, isError } = api.plant.getPlantByWateringDay.useQuery(
    new Date(Date.parse(date)),
  );
  const colorScheme = useColorScheme();

  if (isError || !data?.length) return <Text>Aucun arrosage à venir</Text>;

  return (
    <Skeleton.Group show={isLoading}>
      <View className="gap-sm">
        {data.map((plant) => (
          <Skeleton
            key={`${plant.id}-snippet`}
            colorMode={colorScheme === "dark" ? "dark" : "light"}
          >
            <PlantCardSnippet plant={plant}></PlantCardSnippet>
          </Skeleton>
        ))}
      </View>
    </Skeleton.Group>
  );
}
