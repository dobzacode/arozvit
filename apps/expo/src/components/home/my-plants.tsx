import { ScrollView, Text, useColorScheme, View } from "react-native";
import { Link } from "expo-router";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";
import NextWatering from "./my-plants/next-watering";
import PlantCard from "./my-plants/plant-card";

export default function MyPlants() {
  const { data, isLoading, isError } = api.plant.listID.useQuery();
  const colorScheme = useColorScheme();

  if (isError) return <Text>Error</Text>;
  if (!data) return null;

  return (
    <View className="gap-md pb-4xl">
      <View className="gap-sm">
        <View className="w-full flex-row items-end justify-between px-md align-middle">
          <Text className="heading-h1 -mb-2  text-surface-fg dark:text-surface">
            Mes plantes
          </Text>
          <Link href="myplants">
            <Text className="text-link body-sm ">Voir mes plantes</Text>
          </Link>
        </View>

        <Skeleton.Group show={isLoading}>
          <ScrollView
            contentContainerClassName="flex gap-sm pl-md py-sm"
            horizontal={true}
          >
            {data.map(({ id }) => (
              <Skeleton
                key={`${id}-plant-card`}
                colorMode={colorScheme === "dark" ? "dark" : "light"}
              >
                <PlantCard plant={id}></PlantCard>
              </Skeleton>
            ))}
          </ScrollView>
        </Skeleton.Group>
      </View>

      <NextWatering></NextWatering>
    </View>
  );
}
