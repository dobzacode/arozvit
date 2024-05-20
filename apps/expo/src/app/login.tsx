import { Image, Pressable, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Page() {
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
          <Text className="heading-h1 text-surface-fg">
            Bienvenue sur Planty
          </Text>
          <Text className="body-sm text-center text-surface-fg">
            Créer un compte ou connectez-vous et simplifier votre quotidien dès
            aujourd’hui en prenant soin de vos plantes
          </Text>
        </View>
        <View className="grid w-full gap-md">
          <Pressable className="surface-container-low flex w-full flex-row items-center justify-center gap-sm rounded-sm px-md py-sm">
            <AntDesign name="apple1" size={20} color="black" />
            <Text className="button-txt text-center text-surface-fg">
              Continuer avec Apple
            </Text>
          </Pressable>
          <Pressable className="surface-container-low flex w-full flex-row items-center justify-center gap-sm rounded-sm px-md py-sm">
            <AntDesign name="facebook-square" size={20} color="black" />
            <Text className="button-txt text-center text-surface-fg">
              Continuer avec Facebook
            </Text>
          </Pressable>
          <Pressable className="surface-container-low flex w-full flex-row items-center justify-center gap-sm rounded-sm px-md py-sm">
            <AntDesign name="google" size={20} color="black" />
            <Text className="button-txt text-center text-surface-fg">
              Continuer avec Google
            </Text>
          </Pressable>
        </View>
      </View>
      <View className="surface xl absolute -bottom-2 left-1/2 z-10 h-3/4 w-[1100px] -translate-x-1/2 rounded-t-full"></View>
    </>
  );
}
