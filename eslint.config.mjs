import antfu from "@antfu/eslint-config";
import tailwind from "eslint-plugin-tailwindcss";

export default antfu({
  stylistic: {
    indent: 2,
    quotes: "double",
    semi: true,
    trailingComma: null,
  },
  typescript: true,
  vue: true,
}, {
  plugins: {
    tailwind,
  },
  rules: {
    "no-multiple-empty-lines": "error",
    "node/prefer-global/process": "off",
    "style/brace-style": ["warn", "1tbs", { allowSingleLine: true }],
    "vue/no-v-for-template-key": "off",
    "vue/block-order": ["error", {
      order: ["script", "template", "style"],
    }],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "vue/multi-word-component-names": "off",
    "symbol-description": "off",
    "regexp/no-obscure-range": "off",
    "yaml/plain-scalar": "off",
    "tailwind/classnames-order": ["warn"],
    "tailwind/enforces-negative-arbitrary-values": ["warn"],
    "tailwind/enforces-shorthand": ["error"],
    "tailwind/no-contradicting-classname": ["error"],
    "tailwind/no-unnecessary-arbitrary-value": ["error"],
    "tailwind/no-custom-classname": "off",
  },
});
