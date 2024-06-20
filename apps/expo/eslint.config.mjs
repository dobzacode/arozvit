import baseConfig from "@arozvit/eslint-config/base";
import reactConfig from "@arozvit/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [
      ".expo/**",
      "expo-plugins/**",
      "android/**",
      "ios/**",
      "jsdom-env.js",
      "index.js",
    ],
  },
  ...baseConfig,
  ...reactConfig,
];
