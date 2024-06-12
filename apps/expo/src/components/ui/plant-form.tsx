import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-root-toast";
import SelectDropdown from "react-native-select-dropdown";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import moment from "moment-timezone";

import type { Plant } from "@planty/validators";

import { api } from "~/utils/api";
import { translateTimeUnit } from "~/utils/utils";

export default function PlantForm({ plant }: { plant?: Plant }) {
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
  const [lastWatering, setLastWatering] = useState<Date>(
    plant?.lastWatering ?? moment().toDate(),
  );

  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
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
      setName("");
      setSpecies("");
      setDescription("");
      setDayBetweenWatering(1);
      setWateringInterval("jours");
      setLastWatering(moment().tz("Europe/Paris").toDate());
      await utils.plant.isAnyPlant.invalidate();
      await utils.plant.getPlantsWithWateringNeed.invalidate();
      await utils.plant.getBySearchTerm.invalidate();
      router.push("/myplants");
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
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const { mutate: modify, isPending: isMutating } =
    api.plant.update.useMutation({
      onSuccess: async () => {
        await utils.plant.get.invalidate(plant?.id);
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
      description,
      dayBetweenWatering: dayBetweenWatering ?? 1,
      wateringInterval,
      lastWatering,
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
    <View className="gap-lg">
      <View className="gap-md">
        <View className=" gap-xs">
          <Text className="body surface-container-lowest bg-transparent">
            Nom
          </Text>
          <TextInput
            testID="nameInput"
            className={`input-neutral  rounded-xs p-sm shadow-sm ${error?.data?.zodError?.fieldErrors.name && "border border-error-500"}`}
            placeholder="Ma plante"
            value={name}
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
            testID="speciesInput"
            className={`input-neutral  rounded-xs p-sm shadow-sm ${error?.data?.zodError?.fieldErrors.species && "border border-error-500"}`}
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
            numberOfLines={4}
            className={`input-neutral rounded-xs  p-sm align-top shadow-sm ${error?.data?.zodError?.fieldErrors.description && "border border-error-500"}`}
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
      </View>
      <View className="gap-lg">
        <View className="flex flex-row items-center gap-sm">
          <Text className="body text-surface-fg dark:text-surface">
            Arrosage tous les
          </Text>
          <TextInput
            testID="dayBetweenWateringInput"
            value={dayBetweenWatering ? dayBetweenWatering.toString() : ""}
            keyboardType="numeric"
            className="input-neutral h-[44px] w-[44px] self-start rounded-xs p-sm text-center shadow-sm"
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

          <View className="input-neutral flex h-[44px] flex-1 rounded-xs text-sm shadow-sm">
            <SelectDropdown
              disabled={isPending || isMutating}
              data={["jours", "semaines", "mois", "années"]}
              onSelect={(selectedItem) => {
                setWateringInterval(selectedItem as typeof wateringInterval);
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
        </View>
        {error?.data?.zodError?.fieldErrors.wateringFrequency && (
          <Text className="mb-2 text-error-400 dark:text-error-200">
            {error.data.zodError.fieldErrors.wateringFrequency[0]}
          </Text>
        )}

        <View className="flex flex-row items-center gap-sm">
          <Text className="body text-surface-fg dark:text-surface">
            Dernier arrosage le
          </Text>
          <Pressable
            disabled={isPending || isMutating}
            testID="datePickerButton"
            className="input-neutral flex h-[44px] flex-row items-center justify-center gap-md rounded-xs p-sm px-md shadow-sm"
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
        <Pressable
          testID="submitButton"
          disabled={isPending || isMutating}
          onPress={handleSubmit}
          className="primary flex flex-row items-center justify-center gap-md rounded-xs px-md py-2 shadow-sm shadow-black"
        >
          <Text className="button-txt text-primary-fg">
            {plant?.id ? "Modifier" : "Ajouter"} ma plante
          </Text>
          {isPending || isMutating ? (
            <ActivityIndicator size="small" color="white"></ActivityIndicator>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}
