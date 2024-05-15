import baseConfig, { restrictEnvAccess } from "@planty/eslint-config/base";
import nextjsConfig from "@planty/eslint-config/nextjs";
import reactConfig from "@planty/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
