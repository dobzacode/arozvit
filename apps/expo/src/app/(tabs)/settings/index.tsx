import { ScrollView, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AccountSection from "~/components/settings/account/account-section";
import DarkModeSection from "~/components/settings/darkmode-section";
import TopMenu from "~/components/ui/top-menu";

export default function Page() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView>
      <View className="background  w-full gap-md">
        <TopMenu className={`relative`}></TopMenu>
        <View className=" h-full w-full justify-between gap-md  align-middle">
          <Text className="heading-h1  px-md  text-surface-fg dark:text-surface">
            Paramètres
          </Text>
          <ScrollView contentContainerClassName="px-md pb-md gap-lg">
            <DarkModeSection colorScheme={colorScheme}></DarkModeSection>
            <AccountSection></AccountSection>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
