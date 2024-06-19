import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { useRouter } from "expo-router";

import { api } from "~/utils/api";

export default function AccountForm() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const { data, isLoading } = api.user.get.useQuery();

  const utils = api.useUtils();

  const colorScheme = useColorScheme();

  const router = useRouter();

  const { mutate, isPending, error } = api.user.update.useMutation({
    onSuccess: async () => {
      await utils.user.get.invalidate();

      Toast.show("Vos informations ont été modifiées avec succès", {
        duration: 1000,
        backgroundColor: colorScheme === "dark" ? "black" : "white",
        textColor: colorScheme === "dark" ? "white" : "black",
        textStyle: {
          fontFamily: "mustica-pro",
        },
      });

      router.back();
    },
  });

  useEffect(() => {
    if (data?.length === 1 && !isLoading && data[0]) {
      setFirstName(data[0].firstName ?? "Jean");
      setLastName(data[0].lastName ?? "Dupont");
      setUsername(data[0].username ?? "jean.dupont");
    }
  }, [isLoading, data]);

  const handleSubmit = () => {
    const formData = {
      firstName,
      lastName,
      username,
    };

    try {
      mutate(formData);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View className=" h-full">
      <View className="h-full  w-full gap-md px-md">
        <Text className="heading-h1 surface-container-lowest bg-transparent">
          Modifications
        </Text>
        <View className=" w-full gap-xs" testID="name-section">
          <Text className="body surface-container-lowest bg-transparent ">
            Prénom
          </Text>
          <TextInput
            testID="firstNameInput"
            className={`input-neutral  rounded-xs p-sm shadow-sm shadow-black ${error?.data?.zodError?.fieldErrors.name && "border border-error-500"}`}
            value={firstName}
            maxLength={70}
            selectionColor={"hsl(100, 36%, 40%)"}
            editable={!isPending || !isLoading}
            onChangeText={setFirstName}
          ></TextInput>
          {error?.data?.zodError?.fieldErrors.firstName && (
            <Text className="mb-2 text-error-400 dark:text-error-200">
              {error.data.zodError.fieldErrors.firstName[0]}
            </Text>
          )}
        </View>
        <View className=" w-full gap-xs" testID="name-section">
          <Text className="body surface-container-lowest bg-transparent ">
            Nom
          </Text>
          <TextInput
            testID="lastNameInput"
            className={`input-neutral  rounded-xs p-sm shadow-sm shadow-black ${error?.data?.zodError?.fieldErrors.name && "border border-error-500"}`}
            value={lastName}
            maxLength={70}
            selectionColor={"hsl(100, 36%, 40%)"}
            editable={!isPending || !isLoading}
            onChangeText={setLastName}
          ></TextInput>
          {error?.data?.zodError?.fieldErrors.lastName && (
            <Text className="mb-2 text-error-400 dark:text-error-200">
              {error.data.zodError.fieldErrors.lastName[0]}
            </Text>
          )}
        </View>
        <View className=" w-full gap-xs" testID="name-section">
          <Text className="body surface-container-lowest bg-transparent ">
            Nom d'utilisateur
          </Text>
          <TextInput
            testID="userNameInput"
            className={`input-neutral  rounded-xs p-sm shadow-sm shadow-black ${error?.data?.zodError?.fieldErrors.name && "border border-error-500"}`}
            value={username}
            selectionColor={"hsl(100, 36%, 40%)"}
            maxLength={70}
            editable={!isPending || !isLoading}
            onChangeText={setUsername}
          ></TextInput>
          {error?.data?.zodError?.fieldErrors.userName && (
            <Text className="mb-2 text-error-400 dark:text-error-200">
              {error.data.zodError.fieldErrors.userName[0]}
            </Text>
          )}
        </View>
        <Pressable
          testID="submitButton"
          disabled={
            isPending || isLoading || !firstName || !lastName || !username
          }
          onPress={handleSubmit}
          className={`primary  flex flex-row  items-center justify-center gap-md rounded-xs p-smd py-2 shadow-sm shadow-primary ${!firstName || !lastName || !username ? "bg-gray-400 opacity-50" : null}`}
        >
          <Text className="button-txt text-primary-fg">
            Modifier mes informations
          </Text>
          {isPending || isLoading ? (
            <ActivityIndicator size="small" color="white"></ActivityIndicator>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}
