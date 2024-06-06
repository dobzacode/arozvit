import { ScrollView, View } from "react-native";
import moment from "moment-timezone";

import { api } from "~/utils/api";
import Notifications from "./top-block/notifications";
import Today from "./top-block/today";

export default function TopBlock() {
  const { data, isLoading, isError } =
    api.plant.getPlantsWithWateringNeed.useQuery();

  if (!isLoading && !isError && data?.length === 0) {
    return null;
  }

  const today = moment().tz("Europe/Paris").startOf("day").toDate();

  console.log(today);

  const todayWatering = data?.filter(
    (plant) => moment(plant.nextWatering).startOf("days").toDate() === today,
  );
  const passedWateringDay = data?.filter(
    (plant) => moment(plant.nextWatering).startOf("days").toDate() < today,
  );

  if (!todayWatering && !passedWateringDay) {
    return null;
  }

  return (
    <View>
      <ScrollView
        contentContainerClassName="flex gap-md pl-md py-sm"
        horizontal={true}
      >
        {passedWateringDay && passedWateringDay.length > 0 && (
          <Notifications plants={passedWateringDay}></Notifications>
        )}
        {todayWatering && todayWatering.length > 0 && (
          <Today plants={todayWatering}></Today>
        )}
      </ScrollView>
    </View>
  );
}
