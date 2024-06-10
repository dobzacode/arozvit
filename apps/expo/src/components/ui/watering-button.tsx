import { useEffect } from "react";
import { Pressable, Text } from "react-native";
import Toast from "react-native-root-toast";
import { FontAwesome6 } from "@expo/vector-icons";
import moment from "moment";

import type { Plant } from "@planty/validators";

import { api } from "~/utils/api";

export default function WateringButton({
  date,
  plant,
  setIsLoading,
  isIcon = false,
}: {
  date?: Date;
  plant: Plant;
  setIsLoading: (loading: boolean) => void;
  isIcon?: boolean;
}) {
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

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending, setIsLoading]);

  return (
    <Pressable
      disabled={isPending}
      onPress={() =>
        mutate({
          id: plant.id,
          lastWatering: date ? date : moment().tz("Europe/Paris").toDate(),
        })
      }
      className={`relative z-20   items-center whitespace-nowrap rounded-xs  p-md ${!isIcon && "bg-info px-md py-sm"}`}
    >
      {isIcon ? (
        <FontAwesome6 name="droplet" size={24} color="hsl(190 40% 50%)" />
      ) : (
        <Text className="button-txt  text-info-fg">Marquer comme arrosé</Text>
      )}
    </Pressable>
  );
}
