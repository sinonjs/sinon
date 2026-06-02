import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: [
      "node_modules/**",
      ".tap/**",
      ".vitepress/dist/**",
      ".vitepress/cache/**"
    ]
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly"
      }
    },
    plugins: {
      prettier
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error"
    }
  }
];
