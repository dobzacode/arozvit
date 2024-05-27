import { Image, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import AntDesign from "@expo/vector-icons/AntDesign";

import SignInWithOAuth from "~/components/sign-in-with-oauth";

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
      <View className="surface-container-low absolute left-0 top-0 z-0 h-full w-full to-transparent"></View>
      <View className="relative z-20 mx-auto grid h-full w-full max-w-[360px] items-center gap-xl p-md pt-xl">
        <View className="grid items-center gap-sm">
          <Image
            //eslint-disable-next-line
            source={require("./../../assets/home-botanical.png")}
            alt="Home botanical"
          />
          <Text className="heading-h1 text-center text-surface-fg">
            Bienvenue sur Planty
          </Text>
          <Text className="body-sm text-center text-surface-fg">
            Créer un compte ou connectez-vous et simplifier votre quotidien dès
            aujourd’hui en prenant soin de vos plantes
          </Text>
        </View>
        <View className="grid w-full gap-md">
          <SignInWithOAuth strategy="apple" testID="apple-oauth-button">
            <AntDesign name="apple1" size={20} color="black" />
            <Text className="button-txt text-center text-surface-fg">
              Continuer avec Apple
            </Text>
          </SignInWithOAuth>
          <SignInWithOAuth strategy="facebook" testID="facebook-oauth-button">
            <AntDesign name="facebook-square" size={20} color="black" />
            <Text className="button-txt text-center text-surface-fg">
              Continuer avec Facebook
            </Text>
          </SignInWithOAuth>
          <SignInWithOAuth strategy="google" testID="google-oauth-button">
            <AntDesign name="google" size={20} color="black" />
            <Text className="button-txt text-center text-surface-fg">
              Continuer avec Google
            </Text>
          </SignInWithOAuth>
        </View>
      </View>
      <View className="surface xl absolute -bottom-2 left-1/2 z-10 h-3/4 w-[1100px] -translate-x-1/2 rounded-t-full"></View>
    </>
  );
}
