import { Button, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export const SignOutButton = () => {
  const { isLoaded, signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }
  return (
    <View>
      <Button
        title="Sign Out"
        onPress={async () => {
          await signOut();
        }}
      />
    </View>
  );
};