import { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import moment from "moment-timezone";
import { AnimatePresence } from "moti/build";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";
import PlantCardSnippet from "./plant-card-snippet";

export default function PlantSnippetSection({ date }: { date: string }) {
  const colorScheme = useColorScheme();
  const { data, isLoading, isError } = api.plant.getPlantByWateringDay.useQuery(
    moment(date).toDate(),
    { refetchOnMount: true },
  );

  useEffect(() => {
    if (data?.length === 0) {
      console.log(data[0]?.nextWatering);
    }
  });

  if (isError) return null;

  return (
    <View className="gap-sm">
      {isLoading ? (
        [1, 2, 3, 4, 5].map((index) => (
          <Skeleton
            show={true}
            colorMode={colorScheme === "dark" ? "dark" : "light"}
            key={`${index}-skeleton-snippet`}
            height={76}
          >
            <View></View>
          </Skeleton>
        ))
      ) : (
        <AnimatePresence>
          {data
            ? data.map((plant, index) => (
                <PlantCardSnippet
                  key={`plant-snippet-${plant.id}`}
                  index={index}
                  plant={plant}
                ></PlantCardSnippet>
              ))
            : null}
        </AnimatePresence>
      )}
    </View>
  );
}
