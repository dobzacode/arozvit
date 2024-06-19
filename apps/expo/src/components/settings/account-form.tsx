import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { api } from "~/utils/api";

export default function AccountForm() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const { data, isLoading } = api.user.get.useQuery();

  const { mutate, isPending, error } = api.user.update.useMutation();

  useEffect(() => {
    if (data?.length === 1 && !isLoading && data[0]) {
      setFirstName(data[0].firstName ?? "Jean");
      setLastName(data[0].lastName ?? "Dupont");
      setUserName(data[0].username ?? "jean.dupont");
    }
  }, [isLoading, data]);

  const handleSubmit = () => {
    const formData = {
      firstName,
      lastName,
      userName,
    };

    try {
      mutate(formData);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View className=" items-center justify-between gap-md  shadow-sm shadow-black">
      <View className=" w-full gap-xs" testID="name-section">
        <Text className="body surface-container-lowest bg-transparent ">
          Prénom
        </Text>
        <TextInput
          testID="firstNameInput"
          className={`input-neutral  rounded-xs p-sm shadow-sm shadow-black ${error?.data?.zodError?.fieldErrors.name && "border border-error-500"}`}
          value={firstName}
          selectionColor={"hsl(100, 36%, 40%)"}
          editable={!isPending || !isLoading}
          onChangeText={setFirstName}
        ></TextInput>
        {error?.data?.zodError?.fieldErrors.name && (
          <Text className="mb-2 text-error-400 dark:text-error-200">
            {error.data.zodError.fieldErrors.name[0]}
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
          selectionColor={"hsl(100, 36%, 40%)"}
          editable={!isPending || !isLoading}
          onChangeText={setLastName}
        ></TextInput>
        {error?.data?.zodError?.fieldErrors.name && (
          <Text className="mb-2 text-error-400 dark:text-error-200">
            {error.data.zodError.fieldErrors.name[0]}
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
          value={userName}
          selectionColor={"hsl(100, 36%, 40%)"}
          editable={!isPending || !isLoading}
          onChangeText={setUserName}
        ></TextInput>
        {error?.data?.zodError?.fieldErrors.name && (
          <Text className="mb-2 text-error-400 dark:text-error-200">
            {error.data.zodError.fieldErrors.name[0]}
          </Text>
        )}
      </View>
      <Pressable
        testID="submitButton"
        disabled={isPending || isLoading}
        onPress={handleSubmit}
        className={`primary mx-md flex flex-row items-center  justify-center gap-md rounded-xs p-smd py-2 shadow-sm shadow-primary`}
      >
        <Text className="button-txt text-primary-fg">
          Modifier mes informations
        </Text>
        {isPending || isLoading ? (
          <ActivityIndicator size="small" color="white"></ActivityIndicator>
        ) : null}
      </Pressable>
    </View>
  );
}
