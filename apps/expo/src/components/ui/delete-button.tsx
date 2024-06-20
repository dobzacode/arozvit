import { useEffect } from "react";
import { Alert, Pressable, Text, useColorScheme, View } from "react-native";
import Toast from "react-native-root-toast";
import { MaterialIcons } from "@expo/vector-icons";

import type { Plant } from "@arozvit/validators";

import { api } from "~/utils/api";

export default function DeleteButton({
  plant,
  setIsLoading,
  isIcon = false,
  isLoading = false,
}: {
  plant: Plant;
  isLoading?: boolean;
  setIsLoading: (loading: boolean) => void;
  isIcon?: boolean;
}) {
  const utils = api.useUtils();
  const colorScheme = useColorScheme();
  const { mutate, isPending } = api.plant.delete.useMutation({
    onSuccess: async () => {
      await utils.plant.getPlantsWithWateringNeed.invalidate();
      await utils.plant.getBySearchTerm.invalidate();
      await utils.plant.isAnyPlant.invalidate();
      await utils.plant.listID.invalidate();

      Toast.show(`${plant.name} a été supprimée avec succès`, {
        duration: 1000,
        backgroundColor: colorScheme === "dark" ? "black" : "white",
        textColor: colorScheme === "dark" ? "white" : "black",
        containerStyle: {
          marginBottom: 80,
        },
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
      testID={"delete-button"}
      disabled={isPending || isLoading}
      onPress={() =>
        Alert.alert(
          "Attention",
          "La suppression de la plante est définitive, êtes-vous sûr de vouloir continuer ?",
          [
            {
              text: "Annuler",

              style: "cancel",
            },
            {
              text: "Supprimer",
              onPress: () => mutate(plant.id),
              style: "destructive",
            },
          ],
          {
            cancelable: true,
          },
        )
      }
      className={`relative z-20   items-center whitespace-nowrap rounded-xs   ${!isIcon ? "bg-error px-md py-sm shadow-sm shadow-error" : "surface body self-start  p-smd shadow-sm shadow-black dark:bg-neutral-900 dark:shadow-none "} ${isPending || isLoading ? "shadow-white" : ""}  `}
    >
      {isIcon ? (
        <View testID={"delete-icon"}>
          <MaterialIcons name="delete" size={20} color="hsl(352 95% 50%)" />
        </View>
      ) : (
        <Text className="button-txt  text-error-fg">Supprimer la plante</Text>
      )}
    </Pressable>
  );
}
