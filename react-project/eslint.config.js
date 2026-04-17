import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["**/dist/**", "**/build/**", "**/node_modules/**"]
  },

  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    plugins: {
      js,
      react: pluginReact
    },
    extends: [
      "js/recommended",
      pluginReact.configs.flat.recommended
    ],
    languageOptions: {
      globals: globals.browser
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off"
    }
  }
]);