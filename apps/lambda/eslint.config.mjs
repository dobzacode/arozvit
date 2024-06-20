import baseConfig, { restrictEnvAccess } from "@arozvit/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [...baseConfig, ...restrictEnvAccess];
