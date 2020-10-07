module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [ "@typescript-eslint" ],
  rules: {
    indent: [ "error", 2 ],
    "linebreak-style": [ "error", "unix" ],
    quotes: [ "error", "double" ],
    semi: [ "error", "always" ],
    "@typescript-eslint/explicit-function-return-type": [ 0 ],
    "array-bracket-spacing": [ "error", "always" ],
    "object-curly-spacing": [ "error",  "always" ]
  },
};
