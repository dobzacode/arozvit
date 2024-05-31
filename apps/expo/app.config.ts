import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "expo",
  slug: "expo",
  scheme: "expo",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#1F104A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.corentinkittel.planty",
    supportsTablet: true,
  },
  extra: {
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,

    eas: {
      projectId: "986ce81f-fce0-48e9-8166-ca41c3d9a89d",
    },
  },
  android: {
    package: "com.corentinkittel.planty",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
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
  ],
});
