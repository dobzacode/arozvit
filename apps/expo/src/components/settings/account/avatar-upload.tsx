import { useCallback } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";

export default function AvatarUpload({
  image,
  setImage,
  userId,
}: {
  image: { base64?: string; uri: string; key?: string } | null;
  userId: string;
  setImage: ({
    base64,
    uri,
    key,
  }: {
    base64: string;
    uri: string;
    key: string;
  }) => void;
}) {
  const colorScheme = useColorScheme();
  const windowWidth = useWindowDimensions().width;

  const { data, isLoading: isFetchingImage } = api.user.getImage.useQuery(
    void 0,
    {
      staleTime: 86400000,
      refetchInterval: 86400000,
    },
  );
  const [cameraStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  const handleLaunchCamera = useCallback(
    async (gallery: boolean) => {
      const permission = await handleCameraPermission();

      if (!permission && !gallery) {
        Alert.alert("Vous n'avez pas autorisé l'accès à la caméra !");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        selectionLimit: 1,
        quality: 1,
        aspect: [4, 4],
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const base64 = await FileSystem.readAsStringAsync(
          result.assets[0].uri,
          {
            encoding: "base64",
          },
        );

        const id = uuid.v4() as string;
        const key = `${userId}-${id}`;

        setImage({ uri: result.assets[0].uri, base64, key });
      }
    },
    [cameraStatus, setImage, userId],
  );

  const handleCameraPermission = useCallback(async () => {
    if (cameraStatus) {
      if (
        cameraStatus.status === ImagePicker.PermissionStatus.UNDETERMINED ||
        (cameraStatus.status === ImagePicker.PermissionStatus.DENIED &&
          cameraStatus.canAskAgain)
      ) {
        const permission = await requestCameraPermission();
        return permission.granted;
      } else if (cameraStatus.status === ImagePicker.PermissionStatus.DENIED) {
        await Linking.openSettings();
        const permission = await requestCameraPermission();
        return permission;
      } else {
        return true;
      }
    }
  }, [cameraStatus, handleLaunchCamera, requestCameraPermission]);

  console.log(windowWidth);

  return (
    <View className="flex flex-col gap-sm overflow-hidden">
      <Skeleton
        colorMode={colorScheme === "dark" ? "dark" : "light"}
        show={isFetchingImage}
      >
        <Image
          className="rounded-xs "
          style={{ width: windowWidth - 32, height: windowWidth - 32 }}
          resizeMode="cover"
          source={
            //eslint-disable-next-line
            image?.base64
              ? { uri: `data:image/jpeg;base64,${image.base64}` }
              : data === null
                ? require("../../../../assets/placeholder-user.jpg")
                : { uri: `${data}` }
          }
        ></Image>
      </Skeleton>
      <View
        style={{ width: windowWidth - 32 }}
        className="mb-xs flex-row gap-sm"
      >
        <Pressable
          onPress={async () => handleLaunchCamera(true)}
          testID={"watering-button"}
          style={{ width: (windowWidth - 40) / 2 }}
          className={`surface relative z-20  flex-row  items-center justify-center   gap-sm whitespace-nowrap rounded-xs border-[1px] border-surface px-md py-sm shadow-sm shadow-black`}
        >
          <FontAwesome5
            name="images"
            size={16}
            color={colorScheme !== "dark" ? "black" : "white"}
          />
          <Text className="button-txt text-surface-fg  dark:text-surface">
            Galerie
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
