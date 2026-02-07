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

/**
 * Translates backend error messages to user-friendly translated messages
 */
export const translateErrorMessage = (errorMessage: string): string => {
  if (!errorMessage) return i18next.t('errors.unexpectedError');
  
  const lowerMessage = errorMessage.toLowerCase();
  
  // Map common backend error messages to translation keys
  if (lowerMessage.includes('email not found') && lowerMessage.includes('please register first')) {
    return i18next.t('errors.emailNotFound');
  }
  if (lowerMessage.includes('phone number not found') || lowerMessage.includes('please register first')) {
    return i18next.t('errors.phoneNumberNotFound');
  }
  if (lowerMessage.includes('failed to send otp') || lowerMessage.includes('failed to send')) {
    return i18next.t('errors.failedToSendOtp');
  }
  if (lowerMessage.includes('too many requests') || lowerMessage.includes('rate limit')) {
    return i18next.t('errors.tooManyRequests');
  }
  if (lowerMessage.includes('invalid otp') || lowerMessage.includes('otp is invalid')) {
    return i18next.t('errors.invalidOtp');
  }
  if (lowerMessage.includes('otp expired') || lowerMessage.includes('expired')) {
    return i18next.t('errors.otpExpired');
  }
  if (lowerMessage.includes('email already taken') || lowerMessage.includes('email has already been taken')) {
    return i18next.t('errors.emailAlreadyTaken');
  }
  if (lowerMessage.includes('phone field is required') || lowerMessage.includes('the phone field is required')) {
    return i18next.t('errors.phoneFieldRequired');
  }
  if (lowerMessage.includes('phone number already taken') || lowerMessage.includes('phone has already been taken')) {
    return i18next.t('errors.phoneAlreadyTaken');
  }
  if (lowerMessage.includes('invalid credentials') || lowerMessage.includes('incorrect password') || lowerMessage.includes('wrong password')) {
    return i18next.t('errors.invalidCredentials');
  }
  if (lowerMessage.includes('network error') || lowerMessage.includes('network')) {
    return i18next.t('errors.networkError');
  }
  
  // Return original message if no translation found (it might already be translated)
  return errorMessage;
};

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
  } catch {
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
  } catch {
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
      return error;
    });
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number,
): Promise<{
  display_name_ar: string;
  display_name_en: string;
  address: {
    city_ar: string;
    city_en: string;
  };
} | null> => {
  try {
    const apiKey = 'df9958e2fade405ab83129710d14daec';
    // Make two API calls: one for Arabic, one for English
    const [arResponse, enResponse] = await Promise.all([
      axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}&lang=ar`,
      ),
      axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}&lang=en`,
      ),
    ]);

    const arFeature = arResponse.data?.features?.[0];
    const enFeature = enResponse.data?.features?.[0];
    
    if (!arFeature || !enFeature) {
      return null;
    }

    const arProperties = arFeature.properties || {};
    const enProperties = enFeature.properties || {};

    // Extract city names - check multiple possible fields
    // For Arabic, check if the city name is actually in Arabic script
    const getArabicCity = () => {
      // Check various city fields from Arabic response
      const cityFields = [
        arProperties.city,
        arProperties.town,
        arProperties.municipality,
        arProperties.county,
        arProperties.state,
        arProperties.region,
        arProperties.district,
        arProperties.suburb,
      ].filter(Boolean);
      
      // Find the first field that contains Arabic characters
      for (const field of cityFields) {
        if (field && typeof field === 'string' && /[\u0600-\u06FF]/.test(field)) {
          return field;
        }
      }
      
      // Check address components
      if (arProperties.address_line2 && /[\u0600-\u06FF]/.test(arProperties.address_line2)) {
        return arProperties.address_line2;
      }
      
      // Check if address object exists and has localized names
      if (arProperties.address) {
        const address = arProperties.address;
        if (address.city && /[\u0600-\u06FF]/.test(address.city)) {
          return address.city;
        }
        if (address.town && /[\u0600-\u06FF]/.test(address.town)) {
          return address.town;
        }
      }
      
      // If no Arabic found in any field, check if formatted address contains Arabic
      const formatted = arProperties.formatted || arProperties.name || '';
      if (formatted && /[\u0600-\u06FF]/.test(formatted)) {
        // Try to extract city name from formatted address
        // This is a fallback - might not be perfect
        const parts = formatted.split(',').map((p: string) => p.trim());
        for (const part of parts) {
          if (/[\u0600-\u06FF]/.test(part) && part.length < 50) {
            // Likely a city name if it's short and contains Arabic
            return part;
          }
        }
      }
      
      // Last resort: return empty string if no Arabic found
      // This ensures we don't return English as Arabic
      return '';
    };

    const getEnglishCity = () => {
      return enProperties.city || 
             enProperties.town || 
             enProperties.municipality || 
             enProperties.county || 
             enProperties.state ||
             enProperties.region ||
             enProperties.district ||
             enProperties.suburb ||
             '';
    };

    const cityAr = getArabicCity();
    const cityEn = getEnglishCity();
    
    // If Arabic city is empty but we have English, don't use English as Arabic
    // This prevents showing English names when Arabic should be shown

    return {
      display_name_ar: arProperties.formatted || arProperties.name || '',
      display_name_en: enProperties.formatted || enProperties.name || '',
      address: {
        city_ar: cityAr,
        city_en: cityEn,
      },
    };
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

export interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string | number;
}

export const forwardGeocode = async (
  query: string,
): Promise<GeocodeResult[]> => {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }
    const apiKey = 'df9958e2fade405ab83129710d14daec';
    const currentLang = i18n.language || 'ar';
    const lang = currentLang === 'ar' ? 'ar' : 'en';
    
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${apiKey}&lang=${lang}&limit=5&filter=countrycode:sa`,
    );
    
    if (!response.data?.features) {
      return [];
    }
    
    return response.data.features.map((feature: any) => {
      const properties = feature.properties || {};
      const geometry = feature.geometry || {};
      const coordinates = geometry.coordinates || [];
      
      return {
        display_name: properties.formatted || properties.name || '',
        lat: coordinates[1]?.toString() || '',
        lon: coordinates[0]?.toString() || '',
        place_id: feature.properties?.place_id || feature.id || '',
      };
    });
  } catch (error) {
    ShowSnackBar({
      text: i18next.t('errorsWithMaps'),
      type: 'error',
    });
    console.log('Error during forward geocoding: ', error);
    return [];
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
  } catch {
    throw new Error('No FCM token found');
  }
};

export const createdAtHelper = (createdAt: string) => {
  return moment(createdAt)
    .locale(I18nManager.isRTL ? 'ar' : 'en')
    .fromNow();
};








