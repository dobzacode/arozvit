import baseConfig from "@planty/eslint-config/base";
import reactConfig from "@planty/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".expo/**", "expo-plugins/**", "android/**", "ios/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
