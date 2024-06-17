import { useState } from "react";
import { Image, Text, View } from "react-native";
import moment from "moment-timezone";
import { MotiView } from "moti/build";
import { Skeleton } from "moti/skeleton";
import { useColorScheme } from "nativewind";

import type { Plant } from "@planty/validators";

import WateringButton from "~/components/ui/watering-button";
import { api } from "~/utils/api";

export default function PlantCardSnippet({
  plant,
  index = 1,
}: {
  plant: Plant;
  index?: number;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { colorScheme } = useColorScheme();

  const { data, isLoading: isFetchingImage } = api.plant.getImage.useQuery(
    plant.id,
    {
      refetchInterval: 86400000,
      staleTime: 86400000,
    },
  );

  const translateX = index % 2 === 0 ? -100 : 100;

  return (
    <MotiView
      from={{ translateX, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      transition={{ damping: 300 }}
      exit={{ translateX, opacity: 0 }}
      delay={index * 100}
      needsOffscreenAlphaCompositing
    >
      <View
        className={`card-neutral flex-row items-center justify-between  ${isLoading && "disable-opacity shadow-none"}`}
      >
        <View className="flex-row gap-sm">
          <Skeleton
            colorMode={colorScheme === "dark" ? "dark" : "light"}
            show={isFetchingImage}
          >
            <Image
              className="rounded-l-xs"
              style={{ width: 76, height: 76 }}
              resizeMode="cover"
              source={
                //eslint-disable-next-line
                !plant.imageUrl
                  ? require("./../../../../../assets/plant-placeholder.png")
                  : { uri: `${data}` }
              }
            ></Image>
          </Skeleton>
          <View className="justify-between p-sm">
            <Text className="body-sm w-6xl text-surface-fg opacity-40 dark:text-surface dark:opacity-60">
              Prochain arrosage le {""}
              {moment(plant.nextWatering)
                .tz("Europe/Paris")
                .format("DD/MM/YYYY")}
            </Text>
            <Text
              numberOfLines={1}
              className="body text-surface-fg dark:text-surface"
            >
              {plant.name}
            </Text>
          </View>
        </View>
        <View className="p-md shadow-sm shadow-black">
          <WateringButton
            isIcon={true}
            plant={plant}
            setIsLoading={setIsLoading}
          />
        </View>
      </View>
    </MotiView>
  );
}
