import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function EmptyState() {
  const router = useRouter();

  return (
    <View className="flex h-full w-full items-center justify-center gap-lg">
      <Text className="heading-h1 text-surface-fg dark:text-surface ">
        Bienvenue sur Planty
      </Text>
      <Image
        //eslint-disable-next-line
        source={require("./../../../assets/empty-state-plant-illustration.png")}
      ></Image>
      <Text className="body max-w-[300px] text-center text-surface-fg dark:text-surface">
        Tu n&apos;as aucune plante actuellement, commence d&apos;abord par en
        ajouter une !
      </Text>
      <Pressable
        onPress={() => router.push("/newplant")}
        className="primary flex items-center justify-center rounded-xs px-md py-2 shadow-sm shadow-black"
      >
        <Text className="button-txt text-surface-fg dark:text-surface">
          Ajouter une plante
        </Text>
      </Pressable>
    </View>
  );
}
