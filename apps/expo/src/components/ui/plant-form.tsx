import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { ExpandingDot } from "react-native-animated-pagination-dots";
import PagerView, {
  PagerViewOnPageScrollEventData,
} from "react-native-pager-view";
import Toast from "react-native-root-toast";
import SelectDropdown from "react-native-select-dropdown";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { AntDesign, Entypo } from "@expo/vector-icons";
import moment from "moment-timezone";

import type { Plant } from "@planty/validators";

import { api } from "~/utils/api";
import { translateTimeUnit } from "~/utils/utils";
import WateringCalendar from "../home/my-plants/next-watering/watering-calendar";
import ImageUpload from "./image-upload";

export default function PlantForm({ plant }: { plant?: Plant }) {
  const [image, setImage] = useState<null | {
    base64?: string;
    key?: string;
    uri: string;
  }>(
    plant?.imageUrl
      ? {
          uri: plant.imageUrl,
        }
      : null,
  );
  const [name, setName] = useState<string>(plant?.name ?? "");
  const [species, setSpecies] = useState<string>(plant?.species ?? "");
  const [description, setDescription] = useState<string>(
    plant?.description ?? "",
  );
  const [dayBetweenWatering, setDayBetweenWatering] = useState<number | null>(
    plant?.dayBetweenWatering ?? 1,
  );
  const [wateringInterval, setWateringInterval] = useState<
    "jours" | "semaines" | "mois" | "années"
  >(plant?.wateringInterval ?? "jours");
  const [lastWatering, setLastWatering] = useState<string>(
    plant?.lastWatering
      ? moment(plant.lastWatering).tz("Europe/Paris").format("YYYY-MM-DD")
      : moment().tz("Europe/Paris").format("YYYY-MM-DD"),
  );

  const inputRange = [0, 3];
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  const ref = useRef<PagerView>(null);
  const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = useRef(new Animated.Value(0)).current;

  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
  ).interpolate({
    inputRange,
    outputRange: [0, 3 * width],
  });

  const onPageScroll = useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const colorScheme = useColorScheme();
  const utils = api.useUtils();
  const auth = useAuth();

  if (!auth.isLoaded) {
    return <ActivityIndicator size="large" color="green"></ActivityIndicator>;
  }

  if (!auth.userId) {
    router.push("/login");
    return <></>;
  }

  const { mutate, error, isPending } = api.plant.create.useMutation({
    onSuccess: async () => {
      await utils.plant.isAnyPlant.invalidate();
      await utils.plant.getAll.invalidate();
      await utils.plant.getPlantsWithWateringNeed.invalidate();
      await utils.plant.getBySearchTerm.invalidate();
      setName("");
      setSpecies("");
      setDescription("");
      setDayBetweenWatering(1);
      setImage(null);
      setWateringInterval("jours");
      setLastWatering(moment().tz("Europe/Paris").format());
      Toast.show("Votre plante a été ajoutée avec succès", {
        duration: 1000,
        animation: true,
        containerStyle: {
          marginBottom: 80,
        },
        backgroundColor: colorScheme === "dark" ? "black" : "white",
        textColor: colorScheme === "dark" ? "white" : "black",
        textStyle: {
          fontFamily: "mustica-pro",
        },
      });
      router.push("/myplants");
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const { mutate: modify, isPending: isMutating } =
    api.plant.update.useMutation({
      onSuccess: async () => {
        await utils.plant.get.invalidate(plant?.id);
        await utils.plant.getImage.invalidate(plant?.id);
        Toast.show(`La plante a été modifiée avec succès`, {
          duration: 1000,
          animation: true,
          containerStyle: {
            marginBottom: 80,
          },
          backgroundColor: colorScheme === "dark" ? "black" : "white",
          textColor: colorScheme === "dark" ? "white" : "black",
          textStyle: {
            fontFamily: "mustica-pro",
          },
        });
        router.back();
      },
      onError: (e) => {
        console.log(e);
      },
    });

  const handleSubmit = () => {
    const formData = {
      userId: auth.userId,
      species,
      name,
      imageObj:
        image?.key && image.base64
          ? { key: image.key, base64: image.base64 }
          : null,
      description,
      dayBetweenWatering: dayBetweenWatering ?? 1,
      wateringInterval,
      lastWatering: moment(lastWatering).toDate(),
      nextWatering: moment(lastWatering)
        .tz("Europe/Paris")
        .add(dayBetweenWatering, translateTimeUnit(wateringInterval))
        .toDate(),
    };

    try {
      plant?.id ? modify({ ...formData, id: plant.id }) : mutate(formData);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View className="h-full gap-md">
      <View className="w-full flex-row items-center justify-between px-md ">
        <Text className="heading-h1 surface-container-lowest bg-transparent">
          {plant?.id ? "Modification" : "Nouvelle plante"}
        </Text>

        <ExpandingDot
          data={[1, 2, 3]}
          expandingDotWidth={30}
          scrollX={scrollX as Animated.Value}
          inActiveDotOpacity={0.6}
          activeDotColor="hsl(98, 20%, 50%)"
          inActiveDotColor={
            colorScheme === "light" ? "hsl(98, 05%, 50%)" : "hsl(98, 20%, 20%)"
          }
          dotStyle={{
            position: "relative",

            borderRadius: 5,
            marginTop: 40,
            height: 6,
          }}
          containerStyle={{
            position: "relative",
          }}
        />
      </View>
      <View className="px-md">
        <View className="w-full bg-neutral-900/[0.2] pt-[1] dark:bg-neutral-400/[0.2] "></View>
      </View>

      <PagerView
        scrollEnabled={true}
        style={{
          width: "100%",
          height: height * 0.61,
        }}
        initialPage={0}
        onPageScroll={onPageScroll}
        ref={ref}
      >
        <ScrollView
          contentContainerStyle={{
            height: height * 0.6,
          }}
          contentContainerClassName="gap-lg pt-md px-md "
          key="1"
        >
          <Text className="heading-h3 font-['mustica-pro-medium']  font-medium text-surface-fg dark:text-surface">
            Informations générales
          </Text>
          <View className=" gap-xs" testID="name-section">
            <Text className="body surface-container-lowest bg-transparent">
              Nom *
            </Text>
            <TextInput
              testID="nameInput"
              className={`input-neutral  rounded-xs p-sm shadow-sm shadow-black ${error?.data?.zodError?.fieldErrors.name && "border border-error-500"}`}
              placeholder="Ma plante"
              value={name}
              maxLength={90}
              selectionColor={"hsl(100, 36%, 40%)"}
              editable={!isPending || !isMutating}
              onChangeText={setName}
            ></TextInput>
            {error?.data?.zodError?.fieldErrors.name && (
              <Text className="mb-2 text-error-400 dark:text-error-200">
                {error.data.zodError.fieldErrors.name[0]}
              </Text>
            )}
          </View>
          <View className=" gap-xs">
            <Text className="body surface-container-lowest bg-transparent">
              Espèce
            </Text>
            <TextInput
              maxLength={90}
              testID="speciesInput"
              className={`input-neutral rounded-xs  p-sm shadow-sm shadow-black ${error?.data?.zodError?.fieldErrors.species && "border border-error-500"}`}
              placeholder="Monstera"
              value={species}
              selectionColor={"hsl(100, 36%, 40%)"}
              editable={!isPending || !isMutating}
              onChangeText={setSpecies}
            ></TextInput>
            {error?.data?.zodError?.fieldErrors.species && (
              <Text className="mb-2 text-error-400 dark:text-error-200">
                {error.data.zodError.fieldErrors.species[0]}
              </Text>
            )}
          </View>
          <View className=" gap-xs">
            <Text className="body surface-container-lowest bg-transparent">
              Description
            </Text>
            <TextInput
              testID="descriptionInput"
              editable={!isPending || !isMutating}
              multiline
              maxLength={255}
              numberOfLines={7}
              className={`input-neutral rounded-xs p-sm  align-top shadow-sm shadow-black ${error?.data?.zodError?.fieldErrors.description && "border border-error-500"}`}
              placeholder="Plante sur la terrasse"
              value={description}
              selectionColor={"hsl(100, 36%, 40%)"}
              onChangeText={setDescription}
            ></TextInput>
            {error?.data?.zodError?.fieldErrors.description && (
              <Text className="mb-2 text-error-400 dark:text-error-200">
                {error.data.zodError.fieldErrors.description[0]}
              </Text>
            )}
          </View>
        </ScrollView>
        <ScrollView
          key="2"
          contentContainerStyle={{ height: height * 0.7 }}
          contentContainerClassName="gap-lg pt-md px-md "
        >
          <Text className="heading-h3 font-['mustica-pro-medium']  font-medium text-surface-fg dark:text-surface">
            Arrosage
          </Text>
          <View className="flex  gap-xs">
            <Text className="body text-surface-fg dark:text-surface">
              Arrosage tous les
            </Text>
            <View className="flex-row gap-md">
              <View className="flex-row items-center ">
                <Pressable
                  disabled={
                    dayBetweenWatering === null || dayBetweenWatering === 1
                  }
                  className={`items-center justify-center rounded-l-xs bg-surface-fg p-smd shadow-sm  shadow-black dark:bg-neutral-400/35 ${dayBetweenWatering === 1 ? "opacity-50" : ""}`}
                  onPress={() =>
                    dayBetweenWatering !== null
                      ? setDayBetweenWatering(
                          dayBetweenWatering > 1 ? dayBetweenWatering - 1 : 1,
                        )
                      : null
                  }
                >
                  <AntDesign name="minus" size={10} color={"white"} />
                </Pressable>
                <TextInput
                  testID="dayBetweenWateringInput"
                  value={
                    dayBetweenWatering ? dayBetweenWatering.toString() : ""
                  }
                  keyboardType="numeric"
                  className="input-neutral h-[44px] w-[44px] self-start rounded-xs p-sm text-center shadow-sm shadow-black"
                  selectionColor={"hsl(100, 36%, 40%)"}
                  editable={!isPending || !isMutating}
                  maxLength={3}
                  onBlur={() => {
                    if (!dayBetweenWatering) {
                      setDayBetweenWatering(1);
                    }
                  }}
                  onChangeText={(text) => {
                    const parsedValue = parseInt(text, 10);
                    if (text === "") {
                      setDayBetweenWatering(null);
                    } else if (!isNaN(parsedValue)) {
                      setDayBetweenWatering(parsedValue);
                    }
                  }}
                ></TextInput>
                <Pressable
                  className={`items-center justify-center rounded-r-xs bg-surface-fg p-smd shadow-sm   shadow-black dark:bg-neutral-400/35 ${dayBetweenWatering === null ? "opacity-50" : ""}`}
                  disabled={dayBetweenWatering === null}
                  onPress={() =>
                    dayBetweenWatering !== null
                      ? setDayBetweenWatering(dayBetweenWatering + 1)
                      : null
                  }
                >
                  <AntDesign name="plus" size={10} color={"white"} />
                </Pressable>
              </View>
              <View className="input-neutral flex h-[44px] flex-1 rounded-xs text-sm shadow-sm shadow-black">
                <SelectDropdown
                  disabled={isPending || isMutating}
                  data={["jours", "semaines", "mois", "années"]}
                  onSelect={(selectedItem) => {
                    setWateringInterval(
                      selectedItem as typeof wateringInterval,
                    );
                  }}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <View
                        testID="wateringIntervalDropdown"
                        style={{
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
                          {wateringInterval}
                        </Text>
                        <Entypo
                          name={
                            isOpened ? "chevron-thin-up" : "chevron-thin-down"
                          }
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
                            colorScheme === "dark"
                              ? "hsl(98, 20%, 5%)"
                              : "white",
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
            </View>
          </View>
          {error?.data?.zodError?.fieldErrors.wateringFrequency && (
            <Text className="mb-2 text-error-400 dark:text-error-200">
              {error.data.zodError.fieldErrors.wateringFrequency[0]}
            </Text>
          )}
          <View className=" gap-sm">
            <Text className="body text-surface-fg dark:text-surface">
              Dernier arrosage
            </Text>
            <WateringCalendar
              key="watering-calendar"
              maxDate={moment().format("YYYY-MM-DD")}
              pickedDate={lastWatering}
              setPickedDate={setLastWatering}
            ></WateringCalendar>
          </View>
        </ScrollView>
        <ScrollView
          key="3"
          contentContainerStyle={{ height: height * 0.65 }}
          contentContainerClassName="gap-lg pt-md px-md "
        >
          <Text className="heading-h3 font-['mustica-pro-medium']  font-medium text-surface-fg dark:text-surface">
            Ajouter une photo
          </Text>
          <View className="gap-sm">
            <ImageUpload
              id={plant?.id ?? null}
              userId={auth.userId}
              image={image}
              setImage={setImage}
            ></ImageUpload>
          </View>
        </ScrollView>
      </PagerView>
      <View className="px-md">
        <View className="w-full bg-neutral-900/[0.2] pt-[1] dark:bg-neutral-400/[0.2] "></View>
      </View>
      <Pressable
        testID="submitButton"
        disabled={isPending || isMutating || name.length === 0}
        onPress={handleSubmit}
        className={`primary mx-md flex flex-row items-center  justify-center gap-md rounded-xs p-smd py-2 shadow-sm shadow-primary ${name.length === 0 && "bg-gray-400 opacity-50"}`}
      >
        <Text className="button-txt text-primary-fg">
          {plant?.id ? "Modifier" : "Ajouter"} ma plante
        </Text>
        {isPending || isMutating ? (
          <ActivityIndicator size="small" color="white"></ActivityIndicator>
        ) : null}
      </Pressable>
    </View>
  );
}
