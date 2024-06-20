import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";

import MyPlants from "~/components/home/my-plants";
import TopBlock from "~/components/home/top-block";
import TopMenu from "~/components/ui/top-menu";
import { api } from "~/utils/api";

export default function Page() {
  const { data, isLoading } = api.plant.isAnyPlant.useQuery();

  return (
    <SafeAreaView className="background">
      <View className="background h-full w-full justify-center gap-md">
        <TopMenu
          className={`${data?.length ? "relative " : "absolute"}`}
        ></TopMenu>
        {isLoading ? (
          <ActivityIndicator size="large" color="green"></ActivityIndicator>
        ) : (
          <>
            {data?.length ? (
              <ScrollView
                className="min-h-[60%] w-full"
                contentContainerClassName="gap-xl"
              >
                <TopBlock></TopBlock>
                <MyPlants></MyPlants>
              </ScrollView>
            ) : (
              <Redirect href={"/newplant"}></Redirect>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
