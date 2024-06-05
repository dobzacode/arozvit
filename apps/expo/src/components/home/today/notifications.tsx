import { Text, View } from "react-native";

import { api } from "~/utils/api";
import { firstLetterCapitalize } from "~/utils/utils";

export default function Notifications() {
  const { data, error, isLoading } =
    api.plant.getPlantsWithWateringNeed.useQuery();

  if (data?.length === 0 || isLoading || error) {
    return null;
  }

  return (
    <View className="surface rounded-sm p-sm shadow-md">
      <Text className="heading-h5 text-surface-fg dark:text-surface">
        Notifications
      </Text>
      {data?.length === 1 && data[0] ? (
        <View>
          <Text>
            {firstLetterCapitalize(data[0].name)} nécessite un arrosage depuis
            le {data[0].nextWatering.toLocaleDateString()}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
