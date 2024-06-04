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

import { api } from "~/utils/api";
import { isPlantNeedingWatering } from "~/utils/utils";

const maxWateringFrequencyPerInterval = {
  jours: 1,
  semaines: 7,
  mois: 31,
  années: 365,
};

export default function NewPlantForm() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [wateringFrequency, setWateringFrequency] = useState<number | null>(1);
  const [wateringInterval, setWateringInterval] = useState<
    "jours" | "semaines" | "mois" | "années"
  >("jours");
  const [lastWatering, setLastWatering] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const colorScheme = useColorScheme();

  const auth = useAuth();

  if (!auth.isLoaded) {
    return <ActivityIndicator size="large" color="green"></ActivityIndicator>;
  }

  if (!auth.userId) {
    router.push("/login");
    return <></>;
  }

  const { mutate, error, isPending } = api.plant.create.useMutation({
    onSuccess: () => {
      setName("");
      setDescription("");
      setWateringFrequency(1);
      setWateringInterval("jours");
      setLastWatering(new Date());
      router.push("/myplants");
      Toast.show("Votre plante a été ajouté avec succès", {
        duration: 400,
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
      needWatering: isPlantNeedingWatering(
        lastWatering,
        wateringFrequency ?? 1,
        wateringInterval,
      ),
      userId: auth.userId,
      name,
      description,
      wateringFrequency: wateringFrequency ?? 1,
      wateringInterval,
      lastWatering,
    };
    try {
      mutate(formData);
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
            placeholder="Monstera"
            value={name}
            selectionColor={"hsl(100, 36%, 40%)"}
            editable={!isPending}
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
            Description
          </Text>
          <TextInput
            testID="descriptionInput"
            editable={!isPending}
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
            Arrosage
          </Text>
          <TextInput
            onBlur={() => {
              if (!wateringFrequency) {
                setWateringFrequency(1);
              } else if (
                wateringFrequency >
                maxWateringFrequencyPerInterval[wateringInterval]
              ) {
                setWateringFrequency(
                  maxWateringFrequencyPerInterval[wateringInterval],
                );
              }
            }}
            testID="wateringFrequencyInput"
            value={wateringFrequency ? wateringFrequency.toString() : ""}
            keyboardType="numeric"
            className="input-neutral h-[44px] w-[44px] self-start rounded-xs p-sm text-center shadow-sm"
            selectionColor={"hsl(100, 36%, 40%)"}
            editable={!isPending}
            maxLength={3}
            onChangeText={(text) => {
              const parsedValue = parseInt(text, 10);
              if (text === "") {
                setWateringFrequency(null);
              } else if (!isNaN(parsedValue)) {
                setWateringFrequency(parsedValue);
              }
            }}
          ></TextInput>
          <Text className="body text-surface-fg dark:text-surface">
            fois par
          </Text>
          <View className="input-neutral flex h-[44px] flex-1 rounded-xs text-sm shadow-sm">
            <SelectDropdown
              disabled={isPending}
              data={["jours", "semaines", "mois", "années"]}
              onSelect={(selectedItem) => {
                setWateringInterval(selectedItem as typeof wateringInterval);
                const newMaxFrequency =
                  maxWateringFrequencyPerInterval[
                    selectedItem as typeof wateringInterval
                  ];
                if (wateringFrequency && wateringFrequency > newMaxFrequency) {
                  setWateringFrequency(newMaxFrequency);
                }
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
            disabled={isPending}
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
            maximumDate={new Date()}
            onConfirm={(date) => {
              setLastWatering(date);
              setDatePickerVisibility(false);
            }}
            onCancel={() => setDatePickerVisibility(false)}
          />
        </View>
        <Pressable
          disabled={isPending}
          onPress={handleSubmit}
          className="primary flex flex-row items-center justify-center gap-md rounded-xs px-md py-2 shadow-sm shadow-black"
        >
          <Text className="button-txt text-primary-fg">Ajouter ma plante</Text>
          {isPending && (
            <ActivityIndicator size="small" color="white"></ActivityIndicator>
          )}
        </Pressable>
      </View>
    </View>
  );
}
