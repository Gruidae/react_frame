module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  extends: 'airbnb',

  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.conf.js',
      },
    },
  },

  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    // "spaced-comment": [0],
    // "no-unused-vars": [0],
    // "no-empty": [0],
    // "react/wrap-multilines": [0],
    // "react/no-multi-comp": [0],
    // "no-constant-condition": [0],
    // "react/jsx-no-bind": [0],
    // "react/prop-types": [0],
    // "arrow-body-style": [0],
    // "react/prefer-stateless-function": [0],
    // "semi": [0],
    // "global-require": [0],
    // "no-shadow": [0],
    // "no-useless-computed-key": [0],
    "no-underscore-dangle": [0],
    "selector-pseudo-class-no-unknown": [0],
    "react/prop-types": [0],
    "import/extensions": [2, "never", { "web.js": "never", "json": "never" }],
    "import/no-extraneous-dependencies": [2, { "devDependencies": true }],
    "import/no-unresolved": [2, { "ignore": ["antd-mobile"] }]
  },

  env: {
    "browser": true,
    "node": true
  }
};
