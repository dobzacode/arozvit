import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "~/components/home/empty-state";
import MyPlants from "~/components/home/my-plants";
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
        {data?.length ? (
          <ScrollView className=" pt-2xl">
            <TopBlock></TopBlock>
            <MyPlants></MyPlants>
          </ScrollView>
        ) : (
          <EmptyState></EmptyState>
        )}
      </View>
    </SafeAreaView>
  );
}
