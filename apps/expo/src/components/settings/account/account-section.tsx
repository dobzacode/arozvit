import { Text, View } from "react-native";

import AccountCard from "./account-card";

export default function AccountSection() {
  return (
    <View className="gap-sm">
      <Text className="heading-h3  font-['mustica-pro-medium'] font-medium text-surface-fg dark:text-surface">
        Informations personnelles
      </Text>
      <AccountCard></AccountCard>
    </View>
  );
}
