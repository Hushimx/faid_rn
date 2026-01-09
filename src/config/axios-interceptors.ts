import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { BASE_URL } from 'common';
import { I18nManager } from 'react-native';
import { useAuthStore } from 'store';
import { checkInternetConnection, ShowSnackBar, translateErrorMessage } from 'utils';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

// API configuration
const API_CONFIG = {
  BASE_URL: BASE_URL, // Replace with your API URL
  TIMEOUT: 120 * 1000, // 120 seconds
  AUTH_TOKEN_KEY: '@auth_token',
};

// Types for API responses
interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      await checkInternetConnection(true);
      // Get token from storage
      const token = useAuthStore.getState().access_token;
      // console.log('access', token);

      //   // If token exists, add to headers
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['Accept-Language'] = I18nManager.isRTL ? 'ar' : 'en';
      }

      // Check if data is FormData - React Native FormData has _parts property
      const isFormData =
        config.data instanceof FormData ||
        (config.data && typeof config.data === 'object' && '_parts' in config.data);

      if (isFormData) {
        // Completely remove Content-Type header - React Native will set it automatically
        // with multipart/form-data and boundary
        if (config.headers) {
          delete config.headers['Content-Type'];
          delete config.headers['content-type'];
        }
        // Prevent axios from transforming FormData - let React Native handle it natively
        // This is crucial for Android to work correctly
        config.transformRequest = [];
        // Also ensure axios doesn't try to serialize it
        config.data = config.data; // Keep as-is
      } else if (config.data && typeof config.data === 'object') {
        // For non-FormData requests (JSON), ensure Content-Type is set correctly
        if (config.headers && !config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/json';
        }
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const message = response?.data?.message;
    const forbiddenEndPoints = ['chats'];
    const isAllowedToShowSnackbar = forbiddenEndPoints.includes(
      response?.config?.url!,
    );

    if (
      response?.config?.method === 'post' &&
      message &&
      isAllowedToShowSnackbar
    )
      ShowSnackBar({
        text: message,
      });

    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized error
    if (error.response?.status === 401) {
      try {
        useAuthStore.getState().setIsLoggedIn(false);
        useAuthStore.getState().setAccessToken(null);
      } catch (refreshError) {
        // If refresh fails, clear auth token
        // await AsyncStorage.removeItem(API_CONFIG.AUTH_TOKEN_KEY);
        return Promise.reject(refreshError);
      }
    }

    const res: any = error?.response;

    // Log the error to Firebase Analytics/Crashlytics
    logApiError(error);

    // Handle API error messages
    const rawErrorMessage =
      error?.response?.data?.message ||
      (error?.code === 'ERR_NETWORK'
        ? 'Network Error: Please check your connection or try again later'
        : error?.message) ||
      'An unexpected error occurred';

    const responseErrors = res?.data?.errors || {};
    const errors = Object.values(responseErrors)?.flat();
    const messageDisplay = errors?.toString();
    
    // Translate error messages
    const translatedMessage = messageDisplay?.length 
      ? translateErrorMessage(messageDisplay) 
      : translateErrorMessage(rawErrorMessage);
    
    if (error?.config?.method != 'get')
      ShowSnackBar({
        text: translatedMessage,
        type: 'error',
      });

    return Promise.reject({
      ...error,
      message: error?.response?.data?.message,
    });
  },
);

// Helper function to log errors to Firebase
const logApiError = async (error: AxiosError<ApiErrorResponse>) => {
  try {
    const errorData = {
      url: error.config?.url || 'unknown',
      method: error.config?.method || 'unknown',
      status: error.response?.status?.toString() || 'unknown',
      code: error.code || 'unknown_code',
      message:
        error.response?.data?.message || error.message || 'unknown error',
      params: error.config?.params ? JSON.stringify(error.config.params) : '',
      requestData: error.config?.data
        ? JSON.stringify(error.config.data).substring(0, 500)
        : '', // Limit size
    };

    // 1. Log to Crashlytics (Real-time reporting)
    // Set custom attributes for easier filtering in dashboard
    crashlytics().setAttributes({
      api_url: errorData.url,
      api_method: errorData.method,
      api_status: errorData.status,
      api_error_code: errorData.code,
    });
    // Log as a non-fatal error
    crashlytics().recordError(
      new Error(
        `API_FAILURE (${errorData.code}): ${errorData.method} ${errorData.url}`,
      ),
      `API_FAILURE: ${errorData.method} ${errorData.url}`,
    );

    // 2. Log to Analytics (Event tracking)
    await analytics().logEvent('api_error', errorData);

    let errorType = 'network_error';
    if (error.response) {
      if (error.response.status >= 500) errorType = 'server_error';
      else if (error.response.status === 401) errorType = 'auth_error';
      else if (error.response.status >= 400) errorType = 'client_error';
    }

    await analytics().logEvent('api_failure', {
      type: errorType,
      ...errorData,
    });
  } catch (loggingError) {
    // Fail silently
  }
};

// Export the configured axios instance
export default axiosInstance;
