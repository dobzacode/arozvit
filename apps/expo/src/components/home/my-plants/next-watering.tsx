import { useState } from "react";
import { Text, useColorScheme, View } from "react-native";
import moment from "moment";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";
import PlantSnippetSection from "./next-watering/plant-snippet-section";
import WateringCalendar from "./next-watering/watering-calendar";

export default function NextWatering() {
  const colorScheme = useColorScheme();

  const [pickedDate, setPickedDate] = useState<string>(
    moment().format("YYYY-MM-DD"),
  );

  const { data, isLoading } = api.plant.getAllWateringDays.useQuery();

  return (
    <View className="gap-sm px-md ">
      <Text className="heading-h1   text-surface-fg dark:text-surface">
        Calendrier d&apos;arrosage
      </Text>
      <Skeleton
        colorMode={colorScheme === "dark" ? "dark" : "light"}
        show={isLoading}
      >
        <WateringCalendar
          marked={data?.map((plant) => plant.date)}
          pickedDate={pickedDate}
          setPickedDate={setPickedDate}
        ></WateringCalendar>
      </Skeleton>
      <PlantSnippetSection date={pickedDate}></PlantSnippetSection>
    </View>
  );
}
