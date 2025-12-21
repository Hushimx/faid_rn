module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  rules: {
    'no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'unused-imports/no-unused-imports': 'error',
  },
  plugins: ['unused-imports'],
};
