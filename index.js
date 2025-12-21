/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
// import './src/i18n';
// import messaging from '@react-native-firebase/messaging';

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

import { name as appName } from './app.json';
if (__DEV__) {
  import('./reactotronConfig').then(() => console.log('Reactotron Configured'));
}
AppRegistry.registerComponent(appName, () => App);
