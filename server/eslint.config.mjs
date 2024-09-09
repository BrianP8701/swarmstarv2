import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["**/generated/**", "**/node_modules/**", "**/dist/**"]
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 12,
      sourceType: "module",
      globals: globals.node
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "no-console": "error",
      "no-constant-condition": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
    }
  }
];