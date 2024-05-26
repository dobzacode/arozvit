import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SignOut } from "~/components/sign-out";

export default function Page() {
  return (
    <SafeAreaView>
      <View className="surface-container-low h-full w-full ">
        <SignOut></SignOut>
      </View>
    </SafeAreaView>
  );
}
