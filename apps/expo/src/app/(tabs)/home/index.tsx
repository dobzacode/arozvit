import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TopMenu from "~/components/top-menu";

export default function Page() {
  return (
    <SafeAreaView>
      <View className="surface-container-low h-full w-full ">
        <TopMenu></TopMenu>
      </View>
    </SafeAreaView>
  );
}
