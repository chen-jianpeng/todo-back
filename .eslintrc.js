module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "plugins": ["prettier"],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "prettier/prettier": "error",
    "no-console": "off"
  }
};