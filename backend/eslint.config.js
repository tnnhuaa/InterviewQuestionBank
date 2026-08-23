import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist/**", "coverage/**"] },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.node,
      sourceType: "module",
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-console": "warn",
      "no-unused-vars": "error",
      "eqeqeq": "error",
      "prefer-const": "error",
      "no-var": "error"
    },
  },
];
