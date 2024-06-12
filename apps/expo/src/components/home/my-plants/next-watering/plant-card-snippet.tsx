import { useState } from "react";
import { Image, Text, View } from "react-native";
import moment from "moment-timezone";
import { MotiView } from "moti/build";

import type { Plant } from "@planty/validators";

import WateringButton from "~/components/ui/watering-button";

export default function PlantCardSnippet({
  plant,
  index = 1,
}: {
  plant: Plant;
  index?: number;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          <Image
            className="rounded-l-xs"
            style={{ width: 76, height: 76 }}
            resizeMode="cover"
            source={
              //eslint-disable-next-line
              require("./../../../../../assets/plant-placeholder.png")
            }
          ></Image>
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
