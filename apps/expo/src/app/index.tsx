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
    <>
      <View className="surface-container-low dark:bg-neutral-850 absolute left-0 top-0 z-0 h-full w-full to-transparent "></View>
      <View className="relative z-20 mx-auto grid h-full w-full  items-center gap-xl p-md pt-xl">
        <View className="grid items-center gap-sm">
          <Image
            //eslint-disable-next-line
            source={require("./../../assets/home-botanical.png")}
            alt="Home botanical"
          />
          <Text role="heading" className="heading-h1 surface text-center">
            Bienvenue sur Arozvit
          </Text>
          <Text className="body-sm surface text-center">
            Créer un compte ou connectez-vous et simplifier votre quotidien dès
            aujourd&apos;hui en prenant soin de vos plantes
          </Text>
        </View>
        <SignInSection></SignInSection>
      </View>
      <View className="surface xl absolute -bottom-2 left-1/2 z-10 h-3/4 w-[1100px] -translate-x-1/2 rounded-t-full"></View>
    </>
  );
}
