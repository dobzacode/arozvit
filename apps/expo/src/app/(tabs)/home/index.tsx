import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "~/components/home/empty-state";
import TopMenu from "~/components/top-menu";

export default function Page() {
  return (
    <SafeAreaView>
      <View className="surface-container-lowest h-full w-full ">
        <TopMenu></TopMenu>
        <EmptyState></EmptyState>
      </View>
    </SafeAreaView>
  );
}
