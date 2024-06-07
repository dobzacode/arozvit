import { ScrollView, View } from "react-native";
import moment from "moment-timezone";

import { api } from "~/utils/api";
import Notifications from "./top-block/notifications";
import Today from "./top-block/today";

export default function TopBlock() {
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
