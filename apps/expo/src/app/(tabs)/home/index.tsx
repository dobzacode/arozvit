import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Skeleton } from "moti/skeleton";

import EmptyState from "~/components/home/empty-state";
import MyPlants from "~/components/home/my-plants";
import NotificationAndToday from "~/components/home/notifications-and-today";
import TopMenu from "~/components/ui/top-menu";
import { api } from "~/utils/api";

export default function Page() {
  const { data, isLoading } = api.plant.isAnyPlant.useQuery();

  return (
    <SafeAreaView>
      <View className="background h-full w-full ">
        <TopMenu className={`${data?.length && "relative"}`}></TopMenu>
        {!isLoading && (
          <>
            {data?.length ? (
              <ScrollView contentContainerClassName="gap-md">
                <NotificationAndToday></NotificationAndToday>

                <MyPlants></MyPlants>
              </ScrollView>
            ) : (
              <Skeleton>
                <EmptyState></EmptyState>
              </Skeleton>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
