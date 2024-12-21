import antfu from "@antfu/eslint-config";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

export default antfu({
  stylistic: {
    indent: 2,
    quotes: "double",
    semi: true,
    trailingComma: null,
  },

  typescript: true,
  vue: true,

  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "vue/no-v-for-template-key": "off",
    "vue/multi-word-component-names": "off",
    "symbol-description": "off",
    "regexp/no-obscure-range": "off",
    "no-multiple-empty-lines": "error",
    "node/prefer-global/process": "off",
    "yaml/plain-scalar": "off",
  },
}, ...compat.config({
  extends: ["plugin:tailwindcss/recommended"],
  rules: {
    "tailwindcss/no-custom-classname": "off",
  },
}));
