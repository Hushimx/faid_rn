import { axiosInstance } from 'config';
import { ISendMessagePayload, IStartChatPayload } from 'types';

const ChatApis = {
  startChat: (data: IStartChatPayload) =>
    axiosInstance.post('chats/start', data),
  sendMessage: (chatId: number, data: ISendMessagePayload) =>
    axiosInstance.post(`chats/${chatId}/messages`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getChatMessages: (chatId: number) =>
    axiosInstance.get(`chats/${chatId}/messages`),
  // getChats:()=>axiosInstance.get("chats"),
};

export default ChatApis;
