import baseConfig, { restrictEnvAccess } from "@arozvit/eslint-config/base";
import nextjsConfig from "@arozvit/eslint-config/nextjs";
import reactConfig from "@arozvit/eslint-config/react";

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
