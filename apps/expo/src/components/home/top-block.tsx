import { ScrollView, Text, useColorScheme, View } from "react-native";
import moment from "moment-timezone";
import { MotiView } from "moti/build";

import { api } from "~/utils/api";
import Notifications from "./top-block/notifications";
import Today from "./top-block/today";

export default function TopBlock() {
  const colorScheme = useColorScheme();

  const { data, isLoading, isError } =
    api.plant.getPlantsWithWateringNeed.useQuery();

  if (isLoading || (isError && !data?.length)) {
    return null;
  }

  const today = moment().utcOffset(0).startOf("day").toDate();

  const todayWatering = data?.filter((plant) => {
    return (
      moment(plant.nextWatering).tz("Europe/Paris").toDate() > today &&
      moment(plant.nextWatering).tz("Europe/Paris").toDate() <
        moment(today).add(1, "day").toDate()
    );
  });

  const passedWateringDay = data?.filter(
    (plant) => moment(plant.nextWatering).toDate() < today,
  );

  if (!todayWatering && !passedWateringDay) {
    return null;
  }

  return (
    <View className="flex ">
      <Text className="heading-h1 px-md text-surface-fg dark:text-surface">
        Notifications
      </Text>
      <ScrollView
        className="h-[150] overflow-visible"
        contentContainerClassName={`flex gap-sm px-md py-sm overflow-visible ${todayWatering && todayWatering.length > 0 ? "h-[150]" : ""} `}
        horizontal={true}
      >
        {passedWateringDay && passedWateringDay.length > 0 && (
          <MotiView
            needsOffscreenAlphaCompositing={
              colorScheme === "light" ? true : false
            }
            from={{ translateY: -10, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
          >
            <Notifications plants={passedWateringDay}></Notifications>
          </MotiView>
        )}
        {todayWatering && todayWatering.length > 0 && (
          <MotiView
            from={{ translateY: -10, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            delay={200}
            needsOffscreenAlphaCompositing={
              colorScheme === "light" ? true : false
            }
          >
            <Today plants={todayWatering}></Today>
          </MotiView>
        )}
      </ScrollView>
    </View>
  );
}
