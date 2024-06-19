import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AccountForm from "~/components/settings/account/account-form";
import GoBackButton from "~/components/ui/goback-button";
import TopMenu from "~/components/ui/top-menu";
import { api } from "~/utils/api";

export default function Page() {
  const { data, isError, isLoading } = api.user.get.useQuery();

  if (isLoading)
    return (
      <ActivityIndicator
        testID="activity-indicator"
        size="large"
        color="green"
      ></ActivityIndicator>
    );

  if (!data || isError || data[0] === undefined) return null;

  return (
    <SafeAreaView>
      <View className="background h-full w-full ">
        <TopMenu className={`relative`}></TopMenu>
        <View className="flex pt-md">
          <AccountForm user={data[0]}></AccountForm>
        </View>
      </View>
      <GoBackButton path="/settings"></GoBackButton>
    </SafeAreaView>
  );
}
