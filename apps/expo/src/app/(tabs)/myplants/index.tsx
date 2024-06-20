import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";

import MyPlantsContent from "~/components/myplants/myplants-content";
import TopMenu from "~/components/ui/top-menu";
import { api } from "~/utils/api";

export default function Page() {
  const { data, isLoading } = api.plant.isAnyPlant.useQuery();

  return (
    <SafeAreaView className="background">
      <View className="background h-full w-full justify-center gap-md">
        <TopMenu
          className={
            isLoading || typeof data?.[0] === "undefined"
              ? `absolute`
              : `relative`
          }
        ></TopMenu>
        {isLoading ? (
          <ActivityIndicator size="large" color="green"></ActivityIndicator>
        ) : (
          <>
            {typeof data?.[0] !== "undefined" ? (
              <View className=" w-full  justify-between gap-md  align-middle">
                <Text
                  testID="mes-plantes-titre"
                  className="heading-h1  px-md  text-surface-fg dark:text-surface"
                >
                  Mes plantes
                </Text>
                <MyPlantsContent></MyPlantsContent>
              </View>
            ) : (
              <Redirect href={"/newplant"}></Redirect>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
