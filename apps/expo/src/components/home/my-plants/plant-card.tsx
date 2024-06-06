import { Image, Text, useColorScheme, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";

import { api } from "~/utils/api";

export default function PlantCard({ plant }: { plant: string }) {
  const colorScheme = useColorScheme();
  const { data, isLoading, isError } = api.plant.get.useQuery(plant);

  if (isLoading || isError) return null;
  if (!data) return null;

  return (
    <View className="card-neutral gap-sm p-sm  ">
      <Image
        className="rounded-xs"
        style={{ width: 160, height: 160 }}
        resizeMode="cover"
        source={
          //eslint-disable-next-line
          require("./../../../../assets/plant-placeholder.png")
        }
      ></Image>
      <Text className="body-sm w-6xl text-surface-fg opacity-40 dark:text-surface dark:opacity-60">
        Prochain arrosage le {""}
        {moment(data[0]?.nextWatering).tz("Europe/Paris").format("DD/MM/YYYY")}
      </Text>
      <View className="w-6xl flex-row  items-center justify-between">
        <Text className="heading-h5 text-surface-fg dark:text-surface">
          {data[0]?.name}
        </Text>
        <AntDesign
          name="right"
          size={20}
          color={colorScheme === "light" ? "black" : "white"}
        />
      </View>
    </View>
  );
}
