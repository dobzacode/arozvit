import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NewPlantForm from "~/components/newplant/newplant-form";
import TopMenu from "~/components/ui/top-menu";

export default function Page() {
  return (
    <SafeAreaView>
      <View className="background  flex h-full w-full  ">
        <TopMenu className={"relative"}></TopMenu>
        <View className="flex gap-md px-md pb-md pt-sm">
          <Text className="heading-h1 surface-container-lowest bg-transparent">
            Nouvelle plante
          </Text>
          <NewPlantForm></NewPlantForm>
        </View>
      </View>
    </SafeAreaView>
  );
}
