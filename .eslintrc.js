module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  env: {
    node: true
  }
};
