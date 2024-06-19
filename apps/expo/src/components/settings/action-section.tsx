import { Text, View } from "react-native";

import { DeleteAccountButton } from "../auth/delete-account-button";
import { SignOutButton } from "../auth/sign-out-button";

export default function ActionSection() {
  return (
    <View className="gap-sm">
      <Text className="heading-h3   font-['mustica-pro-medium'] font-medium text-surface-fg dark:text-surface">
        Actions
      </Text>
      <SignOutButton></SignOutButton>
      <DeleteAccountButton></DeleteAccountButton>
    </View>
  );
}
