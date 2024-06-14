import { useMemo, useState } from "react";
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

import useDebounce from "~/hooks/useDebounce";
import { api } from "~/utils/api";
import PlantCardAction from "./plant-card-action";
import SearchBar from "./search-bar";

export default function MyPlantsContent() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [reverse, setReverse] = useState<boolean>(false);
  const debouncedValue = useDebounce(searchTerm, 250);
  const { data, isLoading } =
    api.plant.getBySearchTerm.useQuery(debouncedValue);
  const colorScheme = useColorScheme();
  const [sortedBy, setSortedBy] = useState<
    "Dernier arrosage" | "Prochain arrosage" | "Nom" | null
  >(null);
  const [lastWatering, setLastWatering] = useState<Date>(moment().toDate());
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);

  const sortedPlant = useMemo(() => {
    if (!data || !sortedBy) {
      return data ? [...data] : null;
    }

    const sortedData = [...data].sort((a, b) => {
      switch (sortedBy) {
        case "Dernier arrosage":
          return reverse
            ? b.lastWatering.getTime() - a.lastWatering.getTime()
            : a.lastWatering.getTime() - b.lastWatering.getTime();
        case "Nom":
          return reverse
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name);
        case "Prochain arrosage":
          return reverse
            ? b.nextWatering.getTime() - a.nextWatering.getTime()
            : a.nextWatering.getTime() - b.nextWatering.getTime();
        default:
          return 0;
      }
    });

    return sortedData;
  }, [data, sortedBy, reverse]);

  const memoizedPlantCard = useMemo(() => {
    if (!sortedPlant) return null;

    return sortedPlant.map((plant, index) => (
      <PlantCardAction
        index={index}
        key={`${plant.id}-plant-card-action-sorted`}
        lastWatering={lastWatering}
        searchTerm={searchTerm}
        colorScheme={colorScheme}
        plant={plant}
      />
    ));
  }, [sortedPlant, lastWatering, searchTerm, colorScheme]);

  return (
    <>
      <View className="gap-sm px-md">
        <SearchBar
          colorScheme={colorScheme}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        ></SearchBar>

        <View className="flex-row gap-xs">
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
                  setReverse(!reverse);
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
        <View className=" items-start gap-xs self-start ">
          <Text className="body-sm text-surface--fg dark:text-surface">
            Marquer comme arrosé le
          </Text>
          <Pressable
            disabled={isLoading}
            testID="datePickerButton"
            className="input-neutral flex h-[44px]  flex-row items-center justify-center gap-md rounded-xs p-sm px-md shadow-sm shadow-black"
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

      <ScrollView contentContainerClassName="flex gap-md px-md pt-md pb-[900]">
        {data
          ? sortedPlant && sortedBy !== null
            ? memoizedPlantCard
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
                key={`${index}-skeleton`}
                height={160}
              >
                <View></View>
              </Skeleton>
            ))}
      </ScrollView>
    </>
  );
}
