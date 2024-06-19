import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NotificationSection from "~/components/notification/notification-section";
import TopMenu from "~/components/ui/top-menu";

export default function Page() {
  return (
    <SafeAreaView>
      <View className="background  w-full gap-md">
        <TopMenu className={`relative`}></TopMenu>
        <View className=" h-full w-full justify-between gap-md  align-middle">
          <Text className="heading-h1  px-md  text-surface-fg dark:text-surface">
            Notifications
          </Text>
          <ScrollView>
            <NotificationSection></NotificationSection>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
