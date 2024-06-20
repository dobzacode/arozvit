import { Alert, Pressable, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { api } from "~/utils/api";

export const DeleteAccountButton = () => {
  const utils = api.useUtils();

  const { mutate, isPending } = api.user.delete.useMutation({
    onSuccess: async () => {
      await utils.plant.isAnyPlant.invalidate();
      await utils.notification.isAnyNotification.invalidate();
    },
  });

  return (
    <Pressable
      disabled={isPending}
      onPress={() =>
        Alert.alert(
          "Attention",
          "La suppression de votre compte est définitive, êtes-vous sûr de vouloir continuer ?",
          [
            {
              text: "Annuler",

              style: "cancel",
            },
            {
              text: "Supprimer",
              onPress: () => mutate(),
              style: "destructive",
            },
          ],
          {
            cancelable: true,
          },
        )
      }
      className=" flex-row items-center justify-between rounded-sm  bg-error px-md py-smd shadow-sm shadow-error "
    >
      <View className="flex-row gap-md">
        <AntDesign
          className="relative z-30 p-md"
          name="delete"
          style={{
            color: "white",
          }}
          size={20}
        />
        <Text className="body text-error-fg ">Supprimer mon compte</Text>
      </View>
    </Pressable>
  );
};
