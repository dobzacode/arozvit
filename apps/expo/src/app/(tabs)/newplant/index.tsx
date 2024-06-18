import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PlantForm from "~/components/ui/plant-form";
import TopMenu from "~/components/ui/top-menu";

export default function Page() {
  return (
    <SafeAreaView>
      <View className="background  flex h-full w-full  ">
        <TopMenu className={"relative"}></TopMenu>
        <View className="flex pt-sm">
          <PlantForm></PlantForm>
        </View>
      </View>
    </SafeAreaView>
  );
}
