import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import i18next from 'i18next';
import messaging from '@react-native-firebase/messaging';

export const checkLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    return checkAndroidLocationPermission();
  } else {
    return checkIOSLocationPermission();
  }
};

const checkAndroidLocationPermission = async (): Promise<boolean> => {
  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (granted) {
      return true;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: i18next.t('locationPermission'),
        message: i18next.t('locationPermissionMessage'),
        buttonNeutral: i18next.t('askMeLater'),
        buttonNegative: i18next.t('cancel'),
        buttonPositive: i18next.t('ok'),
      },
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Location permission error:', err);
    return false;
  }
};

const checkIOSLocationPermission = async (): Promise<boolean> => {
  try {
    const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log('Location service is not available');
        return false;
      case RESULTS.DENIED:
        const requestResult = await request(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );
        return requestResult === RESULTS.GRANTED;
      case RESULTS.GRANTED:
        return true;
      case RESULTS.BLOCKED:
        Alert.alert(
          i18next.t('locationPermission'),
          i18next.t('locationPermissionBlocked'),
        );
        return false;
      default:
        return false;
    }
  } catch (err) {
    console.warn('Location permission error:', err);
    return false;
  }
};

export const requestNotificationPermission = () => {
  if (Platform.OS === 'ios') requestIosUserNotificationPermission();
  else requestAndroidUserNotificationPermission();
};

async function requestIosUserNotificationPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

async function requestAndroidUserNotificationPermission() {
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
}
