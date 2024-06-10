import { useState } from "react";
import { Image, Text, View } from "react-native";
import moment from "moment-timezone";

import type { Plant } from "@planty/validators";

import WateringButton from "~/components/ui/watering-button";

export default function PlantCardSnippet({ plant }: { plant: Plant }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <View
      className={`card-neutral item-center flex-row justify-between p-sm ${isLoading && "disable-opacity shadow-none"}`}
    >
      <View className="flex-row gap-sm">
        <Image
          className="rounded-xs"
          style={{ width: 60, height: 60 }}
          resizeMode="cover"
          source={
            //eslint-disable-next-line
            require("./../../../../../assets/plant-placeholder.png")
          }
        ></Image>
        <View className="justify-between">
          <Text className="body-sm w-6xl text-surface-fg opacity-40 dark:text-surface dark:opacity-60">
            Prochain arrosage le {""}
            {moment(plant.nextWatering).tz("Europe/Paris").format("DD/MM/YYYY")}
          </Text>
          <Text className="body text-surface-fg dark:text-surface">
            {plant.name}
          </Text>
        </View>
      </View>
      <View className="shadow-sm shadow-black">
        <WateringButton
          isIcon={true}
          plant={plant}
          setIsLoading={setIsLoading}
        />
      </View>
    </View>
  );
}
