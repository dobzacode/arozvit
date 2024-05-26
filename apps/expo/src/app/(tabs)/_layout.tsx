import { View } from "react-native";
import { Tabs } from "expo-router";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingTop: 10,
          paddingRight: 15,
          paddingLeft: 15,
          height: 60,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        },

        tabBarActiveTintColor: "#67aa3b",

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
              <View className="h-fit w-fit rounded-full bg-white p-0.5 shadow-sm shadow-black">
                <View className="primary flex h-fit w-fit items-center justify-center rounded-full p-sm">
                  <AntDesign
                    className="w-[20px]"
                    name="plus"
                    size={size}
                    color={"white"}
                  />
                </View>
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarLabel: "calendrier",
          title: "calendrier",
          tabBarIcon: ({ color, size }) => {
            return (
              <FontAwesome5 name="calendar-alt" size={size} color={color} />
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
            return <Feather name="bell" size={size} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
