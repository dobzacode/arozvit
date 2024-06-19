import { useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import moment from "moment-timezone";
import { Skeleton } from "moti/skeleton";

import type { Plant } from "@planty/validators";

import { api } from "~/utils/api";
import DeleteButton from "../ui/delete-button";
import WateringButton from "../ui/watering-button";

export default function PlantCardAction({
  plant,
  colorScheme,
  searchTerm,
  lastWatering,
}: {
  plant: Plant;
  colorScheme: "dark" | "light" | null | undefined;
  searchTerm: string;
  lastWatering: Date;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data, isLoading: isFetchingImage } = api.plant.getImage.useQuery(
    plant.id,
    {
      staleTime: 86400000,
      refetchInterval: 86400000,
    },
  );

  //text-error-900 text-error-800 text-error-700 text-error-600 text-error-500

  return (
    <View className={`card-neutral relative flex-row  gap-xs `}>
      {isLoading && (
        <ActivityIndicator
          testID="loading-indicator"
          className="absolute right-sm top-sm"
          color={colorScheme === "dark" ? "white" : "black"}
        ></ActivityIndicator>
      )}
      <Skeleton
        width={190}
        height={160}
        colorMode={colorScheme === "dark" ? "dark" : "light"}
        show={isFetchingImage}
      >
        <Image
          className="-xs rounded-l"
          style={{ width: 190, height: 160 }}
          resizeMode="cover"
          source={
            //eslint-disable-next-line
            !plant.imageUrl
              ? require("./../../../assets/plant-placeholder.png")
              : { uri: `${data}` }
          }
        ></Image>
      </Skeleton>
      <View className="flex-grow justify-between  gap-sm p-sm ">
        <View className="gap-xs">
          <Text
            className={`body-sm w-6xl text-surface-fg opacity-40 dark:text-surface dark:opacity-60 ${moment().diff(plant.lastWatering, "days") > 1 && "text-error-500 opacity-100"}`}
          >
            Arrosé le {""}
            {moment(plant.lastWatering).tz("Europe/Paris").format("DD/MM/YYYY")}
          </Text>
          <Text className="body-sm w-6xl text-surface-fg opacity-40 dark:text-surface dark:opacity-60">
            Prochain arrosage le {""}
            {moment(plant.nextWatering).tz("Europe/Paris").format("DD/MM/YYYY")}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          className="heading-h5  w-5xl overflow-clip text-surface-fg dark:text-surface"
        >
          {plant.name}
        </Text>
        <View className="gap-sm">
          <View className=" flex-row gap-sm">
            <WateringButton
              isLoading={isLoading}
              date={lastWatering}
              searchTerm={searchTerm}
              isIcon={true}
              plant={plant}
              setIsLoading={setIsLoading}
            />
            <Link disabled={isLoading} href={`/myplants/${plant.id}`}>
              <View
                className={`surface body relative z-20  items-center self-start    whitespace-nowrap   rounded-xs p-smd shadow-sm  shadow-black ${isLoading && "shadow-white"}`}
              >
                <FontAwesome
                  name="cog"
                  size={20}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </View>
            </Link>
            <DeleteButton
              isLoading={isLoading}
              plant={plant}
              setIsLoading={setIsLoading}
              isIcon={true}
            ></DeleteButton>
          </View>
        </View>
      </View>
    </View>
  );
}
