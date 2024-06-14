import { useCallback } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";

export default function ImageUpload({
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
  const [cameraStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  const handleLaunchCamera = useCallback(
    async (gallery: boolean) => {
      const permission = await handleCameraPermission();
      console.log(cameraStatus);
      if (!permission && !gallery) {
        Alert.alert("Vous n'avez pas autorisé l'accès à la caméra !");
        return;
      }
      const result = gallery
        ? await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,

            selectionLimit: 1,
            quality: 1,
            aspect: [3, 4],
          })
        : await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,

            selectionLimit: 1,
            quality: 1,
            aspect: [3, 4],
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

  return (
    <View className="flex w-full flex-row gap-sm">
      <Image
        className="h-[150] w-[150] rounded-xs"
        resizeMode="cover"
        source={
          //eslint-disable-next-line
          image?.uri
            ? { uri: image.uri }
            : require("../../../assets/plant-placeholder.png")
        }
      ></Image>
      <View className="flex-1  gap-sm">
        <Pressable
          onPress={async () => handleLaunchCamera(true)}
          testID={"watering-button"}
          className={`relative z-20 flex-row items-center  justify-center gap-sm   whitespace-nowrap rounded-xs border-[1px] border-surface px-md py-sm`}
        >
          <FontAwesome5
            name="images"
            size={20}
            color={colorScheme !== "dark" ? "black" : "white"}
          />
          <Text className="button-txt  text-surface">Ouvrir ma galerie</Text>
        </Pressable>
        <Pressable
          onPress={async () => handleLaunchCamera(false)}
          testID={"watering-button"}
          className={`relative z-20  flex-row items-center justify-center gap-sm   whitespace-nowrap rounded-xs bg-surface-fg px-md py-sm dark:bg-surface`}
        >
          <FontAwesome5
            name="camera-retro"
            size={20}
            color={colorScheme === "dark" ? "black" : "white"}
          />
          <Text className="button-txt  text-surface dark:text-surface-fg">
            Prendre une photo
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
