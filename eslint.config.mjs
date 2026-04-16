import js from "@eslint/js"
import globals from "globals"
import reactPlugin from "eslint-plugin-react"

export default [
  {
    ignores: [
      "node_modules/**",
      "public/**",
      ".cache/**",
      "static/admin/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react/prop-types": "off",
      "react/no-unknown-property": [
        "error",
        {
          ignore: ["sx"],
        },
      ],
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_|^getNode$",
          varsIgnorePattern: "^(React|jsx)$",
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]
