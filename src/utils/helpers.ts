import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import i18n from 'i18n';
import i18next from 'i18next';
import { I18nManager } from 'react-native';
import GetLocation from 'react-native-get-location';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import { getLocales } from 'react-native-localize';
import RNrestart from 'react-native-restart';
import { IResponseMeta, LANGUAGES_ENUM } from 'types';
import { ShowSnackBar } from './snack-bar';
import { getMessaging } from '@react-native-firebase/messaging';
import moment from 'moment';
import 'moment/locale/ar';
export const checkInternetConnection = async (disbaleSnackBar?: boolean) => {
  try {
    const res = await NetInfo.fetch();

    if (
      (!res.isConnected || res.isInternetReachable === false) &&
      !disbaleSnackBar
    ) {
      ShowSnackBar({
        text: i18next.t('errors.checkInternetConnection'),
      });
      throw new Error('No Internet Connection');
    }

    return true;
  } catch (e) {
    if (!disbaleSnackBar)
      ShowSnackBar({
        text: i18next.t('errors.checkInternetConnection'),
      });
    throw e;
  }
};

export const imagePicker = async (
  props?: Omit<ImageLibraryOptions, 'mediaType'>,
) => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      ...props,
    });

    if (result?.assets) {
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      const validAssets = result.assets.filter(
        asset => (asset.fileSize ?? 0) <= MAX_SIZE,
      );

      if (validAssets.length < result.assets.length) {
        ShowSnackBar({
          text: i18next.t('maxUploadSizeForImage'),
        });
        // throw new Error('Max Size');
      }

      return { ...result, assets: validAssets };
    }

    return result;
  } catch (e) {
    return null;
  }
};

export const imageVideoPicker = async (
  props?: Omit<ImageLibraryOptions, 'mediaType'>,
) => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      ...props,
    });

    if (result?.assets) {
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      const validAssets = result.assets.filter(
        asset => (asset.fileSize ?? 0) <= MAX_SIZE,
      );

      if (validAssets.length < result.assets.length) {
        ShowSnackBar({
          text: i18next.t('maxUploadSizeForImage'),
        });
        throw new Error('Max Size');
      }

      return { ...result, assets: validAssets };
    }

    return result;
  } catch (e) {
    return null;
  }
};
export const dataExtractor = <T>(res: any): T => res?.data?.data;
export const metaExtractor = (res: any): IResponseMeta => res?.data?.meta;

export const appChangeLangaugeHandler = async (lang: LANGUAGES_ENUM) => {
  const isArabic = lang === LANGUAGES_ENUM.ar;
  try {
    await AsyncStorage.setItem('lang', lang);
    I18nManager.forceRTL(isArabic);
    I18nManager.allowRTL(isArabic);
    await i18n.changeLanguage(lang);
    RNrestart.restart();
  } catch (e) {
    console.error(e);
  }
};

export const getStoredAppLannguae = async () =>
  await AsyncStorage.getItem('lang');

export const getCurrentDeviceLanguage = (): 'en' | 'ar' => {
  const locales = getLocales();

  const deviceLang = locales[0]?.languageTag;

  const appLng = deviceLang;
  return appLng?.includes('en-') ? 'en' : 'ar';
};

export const phoneNumberShapeCreator = ({
  phone,
  callingCode,
}: {
  phone: string;
  callingCode: string;
}) => `+${callingCode}${phone}`;

export const getCurrentLocation = () => {
  return GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 60000,
  })
    .then(location => {
      return location;
    })
    .catch(error => {
      const { code, message } = error;
      return error;
    });
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number,
): Promise<{
  display_name: string;
  address: {
    city: string;
  };
} | null> => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
    );
    // const address = response.data.display_name;
    return response.data; // Return the formatted address
  } catch (error) {
    ShowSnackBar({
      text: i18next.t('errorsWithMaps'),
      type: 'error',
    });
    // Handle any request or processing errors
    console.log('Error during reverse geocoding: ', error);
    return null;
  }
};

export const regionFrom = (lat: number, lon: number, distance = 1000) => {
  const distanceInMeters = distance;
  const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
  const circumference = (40075 / 360) * 1000;

  const latDelta = distanceInMeters * (1 / (Math.cos(lat) * circumference));
  const lonDelta = distanceInMeters / oneDegreeOfLongitudeInMeters;

  return {
    latitude: lat,
    longitude: lon,
    latitudeDelta: Math.max(0, latDelta),
    longitudeDelta: Math.max(0, lonDelta),
  };
};

export const isInsideSaudiArabia = (lat: number, lng: number) => {
  return lat >= 16.29 && lat <= 32.16 && lng >= 34.57 && lng <= 55.67;
};

export const fcmTokenGenerator = async () => {
  try {
    const fcmToken = await getMessaging().getToken();
    if (!fcmToken) {
      throw new Error('No FCM token found');
    }
    return fcmToken;
  } catch (e) {
    throw new Error('No FCM token found');
  }
};

export const createdAtHelper = (createdAt: string) => {
  return moment(createdAt)
    .locale(I18nManager.isRTL ? 'ar' : 'en')
    .fromNow();
};
