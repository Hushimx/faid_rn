import { axiosInstance } from 'config';
import { BASE_URL } from 'common';
import { useAuthStore } from 'store';
import { I18nManager } from 'react-native';
import { ISendMessagePayload, IStartChatPayload } from 'types';

// Custom function to send messages with files using fetch (works better on Android)
// React Native's fetch API handles FormData correctly, while axios uses XMLHttpRequest which has bugs
const sendMessageWithFile = async (
  chatId: number,
  formData: FormData,
): Promise<any> => {
  const token = useAuthStore.getState().access_token;
  const url = `${BASE_URL}chats/${chatId}/messages`;
  console.log(token);

  const headers: HeadersInit = {
    Accept: 'application/json',
    'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Don't set Content-Type - let fetch set it automatically with boundary
  // This is crucial for Android to work correctly
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  const responseData = await response.json();

  if (!response.ok) {
    const errorMessage =
      responseData?.message ||
      responseData?.errors ||
      `HTTP error! status: ${response.status}`;
    const error: any = new Error(errorMessage);
    error.response = {
      status: response.status,
      data: responseData,
    };
    throw error;
  }

  // Return in axios-like format for consistency
  return { data: responseData };
};

const ChatApis = {
  startChat: (data: IStartChatPayload) =>
    axiosInstance.post('chats/start', data),
  sendMessage: async (chatId: number, data: ISendMessagePayload | FormData) => {
    // Use fetch for FormData (fixes Android issue), axios for JSON
    if (data instanceof FormData || (data && typeof data === 'object' && '_parts' in data)) {
      return sendMessageWithFile(chatId, data as FormData);
    } else {
      // Use axios for JSON messages
      return axiosInstance.post(`chats/${chatId}/messages`, data);
    }
  },
  getChatMessages: (chatId: number) =>
    axiosInstance.get(`chats/${chatId}/messages`),
  getChats: () => axiosInstance.get('chats'),
  reportChat: (chatId: number, reason: string) =>
    axiosInstance.post(`chats/${chatId}/report`, { reason }),
};

export default ChatApis;
