import { useEffect } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import Toast from "react-native-root-toast";
import { FontAwesome6 } from "@expo/vector-icons";
import moment from "moment-timezone";

import type { Plant } from "@arozvit/validators";

import { api } from "~/utils/api";

export default function WateringButton({
  date,
  plant,
  setIsLoading,
  isIcon = false,
  searchTerm,
  isLoading = false,
}: {
  date?: Date;
  plant: Plant;
  setIsLoading: (loading: boolean) => void;
  isIcon?: boolean;
  searchTerm?: string;
  isLoading?: boolean;
}) {
  const utils = api.useUtils();
  const colorScheme = useColorScheme();

  const { mutate, isPending } = api.plant.waterPlant.useMutation({
    onSuccess: async () => {
      await utils.plant.getPlantsWithWateringNeed.invalidate();
      await utils.plant.get.invalidate(plant.id);
      await utils.plant.getAllWateringDays.invalidate();
      await utils.plant.getPlantByWateringDay.invalidate(
        moment().tz("Europe/Paris").toDate(),
      );
      await utils.plant.isWatered.invalidate(plant.id);
      searchTerm !== undefined
        ? await utils.plant.getBySearchTerm.invalidate(searchTerm)
        : null;
      Toast.show(`${plant.name} a été arrosée avec succès`, {
        duration: 1000,
        containerStyle: {
          marginBottom: 80,
        },
        backgroundColor: colorScheme === "dark" ? "black" : "white",
        textColor: colorScheme === "dark" ? "white" : "black",
        textStyle: {
          fontFamily: "mustica-pro",
        },
      });
    },
    onError: (e) => {
      console.log(e);
    },
  });

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending, setIsLoading]);

  return (
    <Pressable
      testID={"watering-button"}
      disabled={
        isPending ||
        isLoading ||
        moment(date).format("DD/MM/YYYY") ===
          moment(plant.lastWatering).format("DD/MM/YYYY")
      }
      onPress={() =>
        mutate({
          id: plant.id,
          lastWatering: date ? date : moment().tz("Europe/Paris").toDate(),
        })
      }
      needsOffscreenAlphaCompositing
      className={`relative z-20   items-center whitespace-nowrap rounded-xs   ${!isIcon ? " bg-info px-md py-sm shadow-sm shadow-info" : "surface body self-start p-smd shadow-sm  shadow-black dark:bg-neutral-900 dark:shadow-none"} ${
        isPending ||
        isLoading ||
        moment(date).format("DD/MM/YYYY") ===
          moment(plant.lastWatering).format("DD/MM/YYYY")
          ? "shadow-white"
          : ""
      }  `}
    >
      {isIcon ? (
        <View
          testID={"watering-icon"}
          className={
            moment(date).format("DD/MM/YYYY") ===
            moment(plant.lastWatering).format("DD/MM/YYYY")
              ? "opacity-10"
              : ""
          }
        >
          <FontAwesome6 name="droplet" size={20} color="hsl(190 40% 50%)" />
        </View>
      ) : (
        <Text className="button-txt  text-info-fg">Marquer comme arrosé</Text>
      )}
    </Pressable>
  );
}
