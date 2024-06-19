import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AccountForm from "~/components/settings/account-form";
import GoBackButton from "~/components/ui/goback-button";
import TopMenu from "~/components/ui/top-menu";

export default function Page() {
  return (
    <SafeAreaView>
      <View className="background h-full w-full ">
        <TopMenu className={`relative`}></TopMenu>
        <View className="flex pt-md">
          <AccountForm></AccountForm>
        </View>
      </View>
      <GoBackButton path="/settings"></GoBackButton>
    </SafeAreaView>
  );
}
