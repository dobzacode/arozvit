import { Pressable, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import moment from "moment";

import type { Plant } from "@planty/validators";

import { api } from "~/utils/api";
import { firstLetterCapitalize } from "~/utils/utils";

export default function Notifications({ plants }: { plants: Plant[] }) {
  const plantToWater = plants.reduce((planteMax, plante) => {
    return plante.nextWatering > planteMax.nextWatering ? plante : planteMax;
  });

  const { mutate, isPending } = api.plant.waterPlant.useMutation({
    onSuccess: () => {
      Toast.show(`${plantToWater.name} a été arrosée avec succès`, {
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
      className={`card-neutral w-7xl gap-sm rounded-sm p-sm shadow-md ${isPending && "opacity-50"}`}
    >
      <Text className="heading-h4 text-surface-fg dark:text-surface">
        Notification
      </Text>

      <Text className="body text-surface-fg dark:text-surface">
        {firstLetterCapitalize(plantToWater.name)} nécessite un arrosage depuis
        le {plantToWater.nextWatering.toLocaleDateString()}
      </Text>
      <Pressable
        disabled={isPending}
        onPress={() =>
          mutate({
            id: plantToWater.id,
            lastWatering: moment().tz("Europe/Paris").toDate(),
          })
        }
        className="mt-sm items-center justify-center rounded-xs  bg-info py-xs shadow-sm shadow-black"
      >
        <Text className="button-txt text-info-fg">Marquer comme arrosé</Text>
      </Pressable>
    </View>
  );
}
