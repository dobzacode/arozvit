import { Alert, Pressable, Text, useColorScheme, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";

export const DeleteAccountButton = () => {
  const colorScheme = useColorScheme();

  const { mutate, isPending } = api.user.delete.useMutation();

  return (
    <Skeleton colorMode={colorScheme === "dark" ? "dark" : "light"}>
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
        className=" flex-row items-center justify-between bg-error p-md px-md py-sm shadow-sm shadow-error "
      >
        <View className="flex-row gap-md">
          <Ionicons
            className="relative z-30 p-md"
            name="exit-outline"
            style={{
              color: "white",
            }}
            size={20}
          />
          <Text className="body text-surface-fg dark:text-surface">
            Supprimer mon compte
          </Text>
        </View>
      </Pressable>
    </Skeleton>
  );
};
