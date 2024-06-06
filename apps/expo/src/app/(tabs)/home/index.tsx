import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "~/components/home/empty-state";
import TopBlock from "~/components/home/top-block";
import TopMenu from "~/components/ui/top-menu";
import { api } from "~/utils/api";

export default function Page() {
  const { data, isLoading } = api.plant.isAnyPlant.useQuery();

  if (isLoading)
    return <ActivityIndicator size="large" color="green"></ActivityIndicator>;

  return (
    <SafeAreaView>
      <View className="background h-full w-full ">
        <TopMenu></TopMenu>
        {data?.length ? <TopBlock></TopBlock> : <EmptyState></EmptyState>}
      </View>
    </SafeAreaView>
  );
}
