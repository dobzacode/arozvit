import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

export default function NewPlantForm() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequence, setFrequence] = useState<number>(1);
  const [interval, setInterval] = useState<
    "jours" | "semaines" | "mois" | "années"
  >("jours");
  const [dernierArrosage, setDernierArrosage] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);

  return (
    <View className="gap-lg">
      <View className="gap-md">
        <View className=" gap-xs">
          <Text className="body surface-container-lowest">Nom</Text>
          <TextInput
            className="input-neutral  rounded-xs p-sm shadow-sm"
            placeholder="Monstera"
            value={name}
            selectionColor={"hsl(100, 36%, 40%)"}
            onChangeText={setName}
          ></TextInput>
        </View>
        <View className=" gap-xs">
          <Text className="body surface-container-lowest">Description</Text>
          <TextInput
            multiline
            numberOfLines={4}
            className="input-neutral  rounded-xs p-sm align-top shadow-sm"
            placeholder="Plante sur la terrasse"
            value={description}
            selectionColor={"hsl(100, 36%, 40%)"}
            onChangeText={setDescription}
          ></TextInput>
        </View>
      </View>
      <View className="gap-lg">
        <View className="flex flex-row items-center gap-sm">
          <Text className="body">Arrosage</Text>
          <TextInput
            value={frequence.toString()}
            keyboardType="numeric"
            className="input-neutral h-2xl w-2xl self-start rounded-xs p-sm text-center shadow-sm"
            selectionColor={"hsl(100, 36%, 40%)"}
            onChangeText={(text) => setFrequence(parseInt(text))}
          ></TextInput>
          <Text className="body">fois par</Text>
          <View className="input-neutral flex h-[44px] flex-1 items-center justify-center rounded-xs text-sm shadow-sm">
            <Picker
              style={{
                width: 160,
              }}
              selectedValue={interval}
              onValueChange={(itemValue) => setInterval(itemValue)}
            >
              <Picker.Item
                fontFamily="mustica-pro"
                style={{
                  fontSize: 14,
                  padding: 0,
                  height: 0,
                }}
                label="Jours"
                value="jours"
              />
              <Picker.Item
                fontFamily="mustica-pro"
                style={{
                  fontSize: 14,
                  padding: 0,
                  height: 0,
                }}
                label="Semaines"
                value="semaines"
              />
              <Picker.Item
                fontFamily="mustica-pro"
                style={{
                  fontSize: 14,
                  padding: 0,
                  height: 0,
                }}
                label="Mois"
                value="mois"
              />
              <Picker.Item
                fontFamily="mustica-pro"
                style={{
                  fontSize: 14,
                  padding: 0,
                  height: 0,
                  fontFamily: "space-grotesk",
                }}
                label="Années"
                value="années"
              />
            </Picker>
          </View>
        </View>
        <View className="flex flex-row items-center gap-sm">
          <Text className="">Dernier arrosage le</Text>
          <Pressable
            className="input-neutral flex h-[44px] flex-row items-center justify-center gap-md rounded-xs p-sm px-md shadow-sm"
            onPress={() => setDatePickerVisibility(true)}
          >
            <Text>
              {dernierArrosage.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
            <FontAwesome5 name="calendar-alt" size={20} color="black" />
          </Pressable>
          <DateTimePickerModal
            textColor="green"
            accentColor="green"
            isVisible={isDatePickerVisible}
            mode="date"
            maximumDate={new Date()}
            onConfirm={(date) => {
              setDernierArrosage(date);
              setDatePickerVisibility(false);
            }}
            onCancel={() => setDatePickerVisibility(false)}
          />
        </View>
        <Pressable
          onPress={() => console.log("submit")}
          className="primary flex items-center justify-center rounded-xs px-md py-2 shadow-sm shadow-black"
        >
          <Text className="button-txt text-primary-fg">Ajouter ma plante</Text>
        </Pressable>
      </View>
    </View>
  );
}