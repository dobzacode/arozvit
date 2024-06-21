import { Image, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import SignInSection from "~/components/auth/sign-in-section";

export default function Page() {
  const auth = useAuth();

  if (!auth.isLoaded) {
    return null;
  }

  if (auth.isSignedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <View className="background relative z-20 mx-auto   h-full w-full gap-xl px-md pb-2xl">
      <View className="w-full flex-1 items-center justify-center gap-xl">
        <View className="items-center gap-sm">
          <Image
            style={{ width: 300, height: 300 }}
            resizeMode="contain"
            //eslint-disable-next-line
            source={require("./../../assets/home-botanical.png")}
            alt="illustration"
          />
          <Text
            role="heading"
            className="heading-h1 text-center text-surface-fg dark:text-surface"
          >
            Bienvenue sur Arozvit
          </Text>
          <Text className="body text-center text-surface-fg dark:text-surface">
            Créer un compte ou connecte toi afin de simplifier ton quotidien dès
            aujourd&apos;hui en prenant soin de tes plantes
          </Text>
        </View>
        <SignInSection></SignInSection>
      </View>
    </View>
  );
}
