import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "arozvit",
  slug: "arozvit",
  scheme: "arozvit",
  description:
    "Prenez le contrôle de l'entretien de vos plantes avec Arozvit, l'outil ultime pour gérer vos plantes d'intérieures et d'extérieures",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",

  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    splash: {
      image: "./assets/black-icon.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
      dark: {
        image: "./assets/white-icon.png",
        resizeMode: "contain",
        backgroundColor: "#FFFFFF",
      },
    },
    bundleIdentifier: "com.corentinkittel.arozvit",
    supportsTablet: true,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
  },
  extra: {
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    eas: {
      projectId: "2c017aa8-a96a-4d87-a0d0-6b812dcd5684",
    },
  },
  android: {
    splash: {
      image: "./assets/black-icon.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
      dark: {
        image: "./assets/white-icon.png",
        resizeMode: "contain",
        backgroundColor: "#FFFFFF",
      },
    },
    package: "com.corentinkittel.arozvit",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#FFFFFF",
    },
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
  },

  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },

  plugins: [
    "expo-router",
    [
      "expo-font",
      {
        fonts: [
          "./assets/fonts/SpaceGrotesk-Bold.ttf",
          "./assets/fonts/MusticaPro-Regular.ttf",
          "./assets/fonts/MusticaPro-Medium.ttf",
        ],
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "L'application utilise votre galerie de photos pour ajouter des images à vos plantes",
        cameraPermission:
          "L'application utilise votre appareil photo pour prendre des photos de vos plantes",
      },
    ],
  ],
});
