import { useState } from "react";
import { Text, View } from "react-native";
import moment from "moment";

import PlantSnippetSection from "./next-watering/plant-snippet-section";
import WateringCalendar from "./next-watering/watering-calendar";

export default function NextWatering() {
  const [pickedDate, setPickedDate] = useState<string>(
    moment().tz("Europe/Paris").format(),
  );

  return (
    <View className="gap-sm px-md ">
      <Text className="heading-h1   text-surface-fg dark:text-surface">
        Arrosages à venir
      </Text>
      <WateringCalendar
        pickedDate={pickedDate}
        setPickedDate={setPickedDate}
      ></WateringCalendar>
      <PlantSnippetSection date={pickedDate}></PlantSnippetSection>
    </View>
  );
}
