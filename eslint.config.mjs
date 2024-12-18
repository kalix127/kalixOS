import antfu from "@antfu/eslint-config";

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
    "vue/no-v-for-template-key": "off",
    "vue/multi-word-component-names": "off",
    "regexp/no-obscure-range": "off",
    "no-multiple-empty-lines": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "node/prefer-global/process": "off",
    "symbol-description": "off",
  },
});
