import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import ActionCard from "~/components/home/my-plants/[id]/action-card";
import MainCard from "~/components/home/my-plants/[id]/main-card";
import WateringCard from "~/components/home/my-plants/[id]/watering-card";
import GoBackButton from "~/components/ui/goback-button";
import TopMenu from "~/components/ui/top-menu";
import { api } from "~/utils/api";

export default function Page() {
  const { id } = useLocalSearchParams();

  if (!id || Array.isArray(id)) return null;

  const { data, isError, isLoading } = api.plant.get.useQuery(id);

  if (isLoading)
    return (
      <ActivityIndicator
        testID="activity-indicator"
        size="large"
        color="green"
      ></ActivityIndicator>
    );

  if (!data || isError || data[0] === undefined) return null;

  return (
    <SafeAreaView>
      <View className="background h-full w-full gap-md">
        <TopMenu className="relative"></TopMenu>
        <View className="flex h-full w-full  gap-md ">
          <Text className="heading-h1 px-md text-surface-fg dark:text-surface">
            Détails
          </Text>
          <ScrollView contentContainerClassName="gap-lg pb-lg px-md">
            <MainCard plant={data[0]}></MainCard>
            <WateringCard plant={data[0]}></WateringCard>
            <ActionCard plant={data[0]}></ActionCard>
          </ScrollView>
        </View>
      </View>
      <GoBackButton path="/myplants"></GoBackButton>
    </SafeAreaView>
  );
}
