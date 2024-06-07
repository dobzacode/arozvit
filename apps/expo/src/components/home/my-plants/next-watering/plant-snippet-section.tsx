import { ActivityIndicator, Text, View } from "react-native";

import { api } from "~/utils/api";
import PlantCardSnippet from "./plant-card-snippet";

export default function PlantSnippetSection({ date }: { date: string }) {
  const { data, isLoading, isError } = api.plant.getPlantByWateringDay.useQuery(
    new Date(Date.parse(date)),
    { refetchOnMount: true },
  );

  if (isLoading)
    return <ActivityIndicator size="large" color="green"></ActivityIndicator>;
  if (isError || !data) return <Text>Error</Text>;

  return (
    <View className="gap-sm">
      {data.map((plant) => (
        <PlantCardSnippet
          key={`${plant.id}-snippet`}
          plant={plant}
        ></PlantCardSnippet>
      ))}
    </View>
  );
}
