module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 15,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/core-modules': ['dayjs']
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }], // Allow jsx syntax in .tsx files
    'react/function-component-definition': 'off',
    'react/require-default-props': 'off',
    'react/no-named-as-default': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'react/no-unstable-nested-components': 'off' | 'warn' | 'error',
    'react/prop-types': 'off',
    'no-useless-catch': 'off'
  }
};
