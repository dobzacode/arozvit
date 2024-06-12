import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SelectDropdown from "react-native-select-dropdown";
import {
  AntDesign,
  Entypo,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import moment from "moment-timezone";
import { MotiView } from "moti/build";
import { Skeleton } from "moti/skeleton";

import type { Plant } from "@planty/validators";

import useDebounce from "~/hooks/useDebounce";
import { api } from "~/utils/api";
import PlantCardAction from "./plant-card-action";
import SearchBar from "./search-bar";

const reversePlantList = (plantList: Plant[]) => {
  let left = 0;
  let right = plantList.length - 1;
  while (left < right) {
    //@ts-expect-error swap
    [plantList[left], plantList[right]] = [plantList[right], plantList[left]];
    left++;
    right--;
  }
};

export default function MyPlantsContent() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedValue = useDebounce(searchTerm, 250);
  const { data, isLoading } =
    api.plant.getBySearchTerm.useQuery(debouncedValue);
  const colorScheme = useColorScheme();
  const [sortedBy, setSortedBy] = useState<
    "Dernier arrosage" | "Prochain arrosage" | "Nom" | null
  >();
  const [lastWatering, setLastWatering] = useState<Date>(moment().toDate());
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [sortedPlant, setSortedPlant] = useState<Plant[] | null>(null);

  useEffect(() => {
    const sortedPlant = !data || !sortedBy ? null : [...data];
    if (!sortedPlant || !sortedBy) return;

    if (sortedBy === "Dernier arrosage") {
      setSortedPlant(
        sortedPlant.sort((a, b) => (a.lastWatering > b.lastWatering ? 1 : -1)),
      );
    } else if (sortedBy === "Nom") {
      setSortedPlant(sortedPlant.sort((a, b) => (a.name > b.name ? 1 : -1)));
    } else {
      setSortedPlant(
        sortedPlant.sort((a, b) => (a.nextWatering > b.nextWatering ? 1 : -1)),
      );
    }
  }, [data, sortedBy]);

  return (
    <>
      <View className="gap-sm px-md">
        <SearchBar
          colorScheme={colorScheme}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        ></SearchBar>

        <View className="flex-row gap-sm">
          <View
            className={`input-neutral flex h-[44px] w-7xl rounded-xs text-sm   dark:h-[46px] ${isLoading || data?.length === 1 ? "disable-opacity shadow-none" : "shadow-sm shadow-black"}`}
          >
            <SelectDropdown
              disabled={isLoading || data?.length === 1}
              data={["Dernier arrosage", "Prochain arrosage", "Nom"]}
              onSelect={(selectedItem) => {
                setSortedBy(selectedItem as typeof sortedBy);
              }}
              renderButton={(_, isOpened) => {
                return (
                  <View
                    testID="wateringIntervalDropdown"
                    style={{
                      gap: 8,
                      height: 40,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 12,
                    }}
                  >
                    <Text
                      className="flex-1 dark:text-white"
                      style={{
                        fontFamily: "mustica-pro",
                      }}
                    >
                      {sortedBy ?? "Trier par"}
                    </Text>
                    <Entypo
                      name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  </View>
                );
              }}
              dropdownStyle={{
                marginTop: -20,
                borderRadius: 4,
                borderColor: "hsl(98, 20%, 20%)",
                borderWidth: colorScheme === "dark" ? 1 : 0,
                borderTopWidth: colorScheme === "dark" ? 2 : 0,
              }}
              renderItem={(item) => {
                return (
                  <View
                    className="bg-white"
                    style={{
                      backgroundColor:
                        colorScheme === "dark" ? "hsl(98, 20%, 5%)" : "white",
                      padding: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: colorScheme === "dark" ? "white" : "black",
                        fontFamily: "mustica-pro",
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
          <MotiView
            animate={{ left: sortedPlant === null ? -120 : 0 }}
            style={{ flexDirection: "row", gap: 8, zIndex: -10 }}
          >
            <Pressable
              disabled={sortedPlant === null}
              onPress={() => {
                setSortedPlant(null);
                setSortedBy(null);
              }}
              className={`input-neutral   relative z-20  items-center self-start whitespace-nowrap rounded-xs  p-smd ${isLoading || data?.length === 1 ? "disable-opacity shadow-none" : "shadow-sm shadow-black"} `}
            >
              <AntDesign
                name="close"
                size={20}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </Pressable>
            <Pressable
              disabled={sortedPlant === null}
              onPress={() => {
                if (sortedPlant) {
                  reversePlantList(sortedPlant);
                  setSortedPlant([...sortedPlant]);
                }
              }}
              className={`input-neutral   relative z-20  items-center self-start whitespace-nowrap rounded-xs  p-smd ${isLoading || data?.length === 1 ? "disable-opacity shadow-none" : "shadow-sm shadow-black"} `}
            >
              <MaterialCommunityIcons
                name="sort"
                size={20}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </Pressable>
          </MotiView>
        </View>
        <View className="flex flex-row items-center gap-sm">
          <Text className="body text-surface--fg dark:text-surface">
            Marquée comme arrosé le
          </Text>
          <Pressable
            disabled={isLoading}
            testID="datePickerButton"
            className="input-neutral flex h-[44px] flex-row items-center justify-center gap-md rounded-xs p-sm px-md shadow-sm shadow-black"
            onPress={() => setDatePickerVisibility(true)}
          >
            <Text className="text-surface-fg dark:text-surface">
              {lastWatering.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
            <FontAwesome5
              name="calendar-alt"
              size={20}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </Pressable>
          <DateTimePickerModal
            testID="dateTimePicker"
            textColor="green"
            accentColor="green"
            isVisible={isDatePickerVisible}
            mode="date"
            date={lastWatering}
            timeZoneName="Europe/Paris"
            maximumDate={moment().utcOffset(0).toDate()}
            onConfirm={(date) => {
              setDatePickerVisibility(false);
              setLastWatering(date);
            }}
            onCancel={() => setDatePickerVisibility(false)}
          />
        </View>
      </View>

      <ScrollView contentContainerClassName="flex gap-md px-md pb-[900]">
        {data
          ? sortedPlant && sortedBy !== null
            ? sortedPlant.map((plant, index) => (
                <PlantCardAction
                  index={index}
                  key={`${plant.id}-plant-card-action`}
                  lastWatering={lastWatering}
                  searchTerm={searchTerm}
                  colorScheme={colorScheme}
                  plant={plant}
                />
              ))
            : data.map((plant, index) => (
                <PlantCardAction
                  index={index}
                  key={`${plant.id}-plant-card-action`}
                  lastWatering={lastWatering}
                  searchTerm={searchTerm}
                  colorScheme={colorScheme}
                  plant={plant}
                />
              ))
          : [1, 2, 3, 4, 5].map((index) => (
              <Skeleton
                colorMode={colorScheme === "dark" ? "dark" : "light"}
                show={isLoading}
                key={index}
                height={160}
              >
                <View></View>
              </Skeleton>
            ))}
      </ScrollView>
    </>
  );
}
