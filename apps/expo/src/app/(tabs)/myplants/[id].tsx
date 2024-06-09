import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TopMenu from "~/components/ui/top-menu";

export default function Page() {
  return (
    <SafeAreaView>
      <View className="background h-full w-full ">
        <TopMenu></TopMenu>
        <View className="flex h-full w-full items-center justify-center gap-lg">
          <Text className="heading-h1 text-surface-fg dark:text-surface ">
            Mes plantes
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
