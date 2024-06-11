import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import GoBackButton from "~/components/ui/goback-button";
import PlantForm from "~/components/ui/plant-form";
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
      <View className="background h-full w-full ">
        <TopMenu className={`relative`}></TopMenu>
        <View className=" w-full  justify-between gap-lg  px-md align-middle ">
          <Text className="heading-h1   text-surface-fg dark:text-surface">
            Modifier
          </Text>
          <PlantForm plant={data[0]}></PlantForm>
        </View>
      </View>
      <GoBackButton path={`/myplants/${id}`}></GoBackButton>
    </SafeAreaView>
  );
}
