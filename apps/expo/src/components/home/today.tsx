import { View } from "react-native";

import Notifications from "./today/notifications";

export default function Today() {
  return (
    <View className="flex-1 items-center justify-center">
      <Notifications></Notifications>
    </View>
  );
}
