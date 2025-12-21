module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components/index',
          '@common': './src/common/index',
          '@screens': './src/screens/index',
          '@utils': './src/utils/index',
          '@hooks': './src/hooks/index',
          '@store': './src/store/index',
          '@config': './src/config/index',
          '@services': './src/services/index',
          '@assets': './src/assets',
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};
