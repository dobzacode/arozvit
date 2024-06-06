import { Image, Pressable, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import { FontAwesome6 } from "@expo/vector-icons";
import moment from "moment";

import type { Plant } from "@planty/validators";

import { api } from "~/utils/api";

export default function PlantCardSnippet({ plant }: { plant: Plant }) {
  const utils = api.useUtils();
  const { mutate, isPending } = api.plant.waterPlant.useMutation({
    onSuccess: async () => {
      await utils.plant.getPlantByWateringDay.invalidate(
        moment().tz("Europe/Paris").toDate(),
      );
      Toast.show(`${plant.name} a été arrosée avec succès`, {
        duration: 400,
        textStyle: {
          fontFamily: "mustica-pro",
        },
      });
    },
    onError: (e) => {
      console.log(e);
    },
  });

  return (
    <View
      className={`card-neutral item-center flex-row justify-between p-sm ${isPending && "opacity-40"}`}
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
            {plant.name} {plant.nextWatering.toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View className="shadow-sm shadow-black">
        <Pressable
          disabled={isPending}
          onPress={() =>
            mutate({
              id: plant.id,
              lastWatering: moment().tz("Europe/Paris").toDate(),
            })
          }
          className="relative z-20   items-center rounded-xs p-md"
        >
          <FontAwesome6 name="droplet" size={24} color="hsl(190 40% 50%)" />
        </Pressable>
      </View>
    </View>
  );
}
