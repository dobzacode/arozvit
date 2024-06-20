import { Image, Text, useColorScheme, View } from "react-native";
import { Link } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import moment from "moment-timezone";
import { MotiView } from "moti/build";
import { Skeleton } from "moti/skeleton";

import type { Plant } from "@arozvit/validators";

import { api } from "~/utils/api";

export default function PlantCard({
  plant,
  index = 1,
}: {
  plant: Plant;
  index: number;
}) {
  const colorScheme = useColorScheme();

  const { data, isLoading } = api.plant.getImage.useQuery(plant.id, {
    staleTime: 86400000,
    refetchInterval: 86400000,
  });

  const formatedDate = moment(plant.nextWatering).format("DD/MM/YYYY");
  const needWatering = plant.nextWatering < moment().toDate();

  return (
    <MotiView
      needsOffscreenAlphaCompositing={colorScheme === "light" ? true : false}
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ opacity: { delay: index * 200 } }}
    >
      <Link
        testID={`plant-card-${plant.id}-link`}
        style={{ elevation: 2 }}
        href={{
          pathname: "/myplants/[id]",
          params: { id: plant.id },
        }}
      >
        <View className="card-neutral gap-sm  ">
          <Skeleton
            width={176}
            height={176}
            show={isLoading}
            colorMode={colorScheme === "dark" ? "dark" : "light"}
          >
            <Image
              className="rounded-t-xs "
              style={{ width: 176, height: 176 }}
              resizeMode="cover"
              source={
                //eslint-disable-next-line
                !plant.imageUrl
                  ? require("./../../../../assets/plant-placeholder.png")
                  : { uri: `${data}` }
              }
            ></Image>
          </Skeleton>

          <View className="gap-sm p-sm ">
            <View className="flex flex-row items-center justify-between">
              <Text
                numberOfLines={2}
                className={`body-sm w-5xl text-start text-surface-fg opacity-40 dark:text-surface dark:opacity-60 `}
              >
                {!needWatering
                  ? `Prochain arrosage le ${formatedDate} `
                  : `Nécessite un arrosage depuis le ${formatedDate}`}
              </Text>
              {needWatering && (
                <View testID="water-icon" className="shrink-0">
                  <Entypo name="water" size={16} color="hsl(190 40% 50%)" />
                </View>
              )}
            </View>
            <View className="w-6xl flex-row  items-end justify-between">
              <Text
                numberOfLines={1}
                className="heading-h5 w-5xl text-surface-fg dark:text-surface"
              >
                {plant.name}
              </Text>
              {/* <MaterialIcons
                name="more-horiz"
                size={16}
                color={colorScheme === "light" ? "black" : "white"}
              /> */}
            </View>
          </View>
        </View>
      </Link>
    </MotiView>
  );
}
