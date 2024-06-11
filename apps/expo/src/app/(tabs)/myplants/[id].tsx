import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

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

  if (!data || isError) return null;

  return (
    <SafeAreaView>
      <View className="background h-full w-full ">
        <TopMenu className="relative"></TopMenu>
        <View className="flex h-full w-full  gap-lg px-md">
          <Text className="heading-h1 text-surface-fg dark:text-surface">
            {data[0]?.name}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
