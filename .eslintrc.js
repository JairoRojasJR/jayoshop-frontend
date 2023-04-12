module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['plugin:react/recommended', 'standard', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react'],
  settings: {
    react: { version: 'detect' }
  },
  rules: {
    quotes: ['error', 'single'],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-curly-brace-presence': ['error', 'never'],
    'jsx-quotes': ['error', 'prefer-single'],
    'react/no-unknown-property': ['error', { ignore: ['jsx'] }]
  }
}
