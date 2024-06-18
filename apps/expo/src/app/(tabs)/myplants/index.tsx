import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MyPlantsContent from "~/components/myplants/myplants-content";
import TopMenu from "~/components/ui/top-menu";

export default function Page() {
  return (
    <SafeAreaView>
      <View className="background  w-full ">
        <TopMenu className={`relative`}></TopMenu>
        <View className=" w-full  justify-between gap-md  align-middle">
          <Text
            testID="mes-plantes-titre"
            className="heading-h1  px-md  text-surface-fg dark:text-surface"
          >
            Mes plantes
          </Text>
          <MyPlantsContent></MyPlantsContent>
        </View>
      </View>
    </SafeAreaView>
  );
}
