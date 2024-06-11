import { Image, Text, View } from "react-native";
import moment from "moment-timezone";

import type { Plant } from "@planty/validators";

import { firstLetterCapitalize } from "~/utils/utils";

export default function MainCard({ plant }: { plant: Plant }) {
  return (
    <View className=" relative h-[140] flex-row gap-sm">
      <View
        testID="image"
        className="surface rounded-xs shadow-sm shadow-black"
      >
        <Image
          className="card-neutral rounded-xs"
          style={{ width: 140, height: 140 }}
          resizeMode="cover"
          source={
            //eslint-disable-next-line
            require("./../../../../../assets/plant-placeholder.png")
          }
        ></Image>
      </View>

      <View className="card-neutral self-start p-sm shadow-sm">
        <Text
          numberOfLines={1}
          className="heading-h2   text-surface-fg dark:text-surface"
        >
          {firstLetterCapitalize(plant.name)}
        </Text>
        {!plant.species && (
          <Text className="body text-surface-fg  dark:text-surface">
            Xdsqdsqdqsdq
          </Text>
        )}
        {plant.species && <Text>{firstLetterCapitalize(plant.species)}</Text>}
        <Text className="body-sm text-surface-fg opacity-40 dark:text-surface dark:opacity-60">
          Ajouté le{" "}
          {moment(plant.createdAt).tz("Europe/Paris").format("DD/MM/YYYY")}
        </Text>
      </View>
    </View>
  );
}
