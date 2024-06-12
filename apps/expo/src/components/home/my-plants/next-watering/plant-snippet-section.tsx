import { useColorScheme, View } from "react-native";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";
import PlantCardSnippet from "./plant-card-snippet";

export default function PlantSnippetSection({ date }: { date: string }) {
  const colorScheme = useColorScheme();
  const { data, isLoading, isError } = api.plant.getPlantByWateringDay.useQuery(
    new Date(Date.parse(date)),
    { refetchOnMount: true },
  );

  if (isError) return null;

  return (
    <View className="gap-sm">
      {isLoading ? (
        [1, 2, 3, 4, 5].map((index) => (
          <Skeleton
            show={true}
            colorMode={colorScheme === "dark" ? "dark" : "light"}
            key={index}
            height={76}
          >
            <View></View>
          </Skeleton>
        ))
      ) : (
        <>
          {data
            ? data.map((plant, index) => (
                <PlantCardSnippet
                  index={index}
                  key={`${plant.id}-snippet`}
                  plant={plant}
                ></PlantCardSnippet>
              ))
            : null}
        </>
      )}
    </View>
  );
}
