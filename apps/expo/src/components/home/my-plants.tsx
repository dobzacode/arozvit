import { ScrollView, Text, useColorScheme, View } from "react-native";
import { Link } from "expo-router";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";
import NextWatering from "./my-plants/next-watering";
import PlantCard from "./my-plants/plant-card";

export default function MyPlants() {
  const { data, isLoading } = api.plant.getAll.useQuery();
  const colorScheme = useColorScheme();

  return (
    <View className=" gap-lg pb-4xl">
      <View className="gap-sm">
        <View className=" flex-row items-end justify-between  px-md align-middle">
          <Text className="heading-h1 -mb-2   text-surface-fg dark:text-surface">
            Mes plantes
          </Text>
          <Link href="myplants" className="">
            <Text className="text-link body-sm ">Voir mes plantes</Text>
          </Link>
        </View>

        <ScrollView
          testID={"my-plants-scrollview"}
          className="h-[286]"
          contentContainerClassName="flex gap-sm pl-md py-sm h-[286]"
          horizontal={true}
        >
          {isLoading || !data ? (
            [1, 2, 3, 4, 5].map((index) => (
              <Skeleton
                colorMode={colorScheme === "dark" ? "dark" : "light"}
                show={true}
                key={index}
                height={280}
                width={172}
              >
                <View></View>
              </Skeleton>
            ))
          ) : (
            <>
              {data.map((plant, index) => (
                <PlantCard index={index} key={plant.id} plant={plant} />
              ))}
            </>
          )}
        </ScrollView>
      </View>

      <NextWatering></NextWatering>
    </View>
  );
}
