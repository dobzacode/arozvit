import { useColorScheme, View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";
import { useAuth } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";

export default function TabsLayout() {
  const route = useRouteInfo();
  const colorScheme = useColorScheme();
  const auth = useAuth();

  const { data, isLoading } = api.notification.isAnyUnread.useQuery();

  if (!auth.isLoaded) {
    return null;
  }

  if (!auth.isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          paddingTop: 10,
          paddingRight: 15,
          paddingLeft: 15,
          height: 60,
          display: "flex",
          backgroundColor:
            colorScheme === "dark" ? "hsl(98, 20%, 5%)" : "white",
          flexDirection: "row",
          justifyContent: "space-around",
        },

        tabBarActiveTintColor:
          colorScheme === "dark" ? "hsl(100, 36%, 75%)" : "#67aa3b",

        tabBarLabelStyle: {
          fontFamily: "mustica-pro",
          fontSize: 10,
          marginBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "accueil",
          title: "accueil",
          tabBarIcon: ({ color, size }) => {
            return <AntDesign name="home" size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="myplants"
        options={{
          tabBarLabel: "mes plantes",
          title: "mes plantes",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                testID="myplants-tabs"
                name="flower-tulip-outline"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="newplant"
        options={{
          tabBarItemStyle: {
            borderRadius: 999,
            marginTop: -36,
            height: 50,
            padding: 2,
          },
          tabBarLabelStyle: {
            display: "none",
          },

          tabBarIcon: ({ size }) => {
            return (
              <View
                className={`h-fit w-fit rounded-full bg-white p-0.5  ${route.pathname === "/newplant" ? " shadow-sm" : "shadow-sm shadow-black "}`}
              >
                <View
                  testID="newplant-tabs"
                  className={`primary flex h-fit w-fit items-center justify-center rounded-full p-sm ${route.pathname === "/newplant" ? "bg-black/[.10] bg-white" : ""}`}
                >
                  <AntDesign
                    className="w-[20px]"
                    name="plus"
                    size={size}
                    color={route.pathname === "/newplant" ? "gray" : "white"}
                  />
                </View>
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: "notifications",
          title: "notifications",
          tabBarIcon: ({ color, size }) => {
            return (
              <View className="relative">
                <View className="absolute right-0 top-0 z-20">
                  <Skeleton
                    width={10}
                    height={10}
                    radius={"round"}
                    colorMode={colorScheme === "dark" ? "dark" : "light"}
                    show={isLoading}
                  >
                    {data && data.length > 0 ? (
                      <View
                        className="rounded-full bg-primary p-xs"
                        style={{ width: 10, height: 10 }}
                      ></View>
                    ) : null}
                  </Skeleton>
                </View>
                <Feather name="bell" size={size} color={color} />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "paramètres",
          title: "paramètres",
          tabBarIcon: ({ color, size }) => {
            return <Feather name="settings" size={size} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
