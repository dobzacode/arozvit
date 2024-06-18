import { Image, Text, View } from "react-native";
import moment from "moment-timezone";
import { Skeleton } from "moti/skeleton";
import { useColorScheme } from "nativewind";

import type { Plant } from "@planty/validators";

import { api } from "~/utils/api";
import { firstLetterCapitalize } from "~/utils/utils";

export default function MainCard({ plant }: { plant: Plant }) {
  const { colorScheme } = useColorScheme();

  const { data, isLoading: isFetchingImage } = api.plant.getImage.useQuery(
    plant.id,
    {
      staleTime: 86400000,
      refetchInterval: 86400000,
    },
  );

  return (
    <View className=" relative h-[140] flex-row gap-sm">
      <View
        testID="image"
        className="surface rounded-xs shadow-sm shadow-black"
      >
        <Skeleton
          width={140}
          height={140}
          colorMode={colorScheme === "dark" ? "dark" : "light"}
          show={isFetchingImage}
        >
          <Image
            className="card-neutral rounded-xs"
            style={{ width: 140, height: 140 }}
            resizeMode="cover"
            source={
              //eslint-disable-next-line
              !plant.imageUrl
                ? require("./../../../../../assets/plant-placeholder.png")
                : { uri: `${data}` }
            }
          ></Image>
        </Skeleton>
      </View>

      <View className="card-neutral self-start p-sm shadow-sm">
        <Text
          numberOfLines={1}
          className="heading-h2   text-surface-fg dark:text-surface"
        >
          {firstLetterCapitalize(plant.name)}
        </Text>

        {plant.species && (
          <Text testID="species">{firstLetterCapitalize(plant.species)}</Text>
        )}
        <Text className="body-sm text-surface-fg opacity-40 dark:text-surface dark:opacity-60">
          Ajouté le{" "}
          {moment(plant.createdAt).tz("Europe/Paris").format("DD/MM/YYYY")}
        </Text>
      </View>
    </View>
  );
}
