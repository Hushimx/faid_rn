import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosInstance } from 'config';
import { useEffect, useState } from 'react';
import ChatApis from 'services/chat';
import {
  IMessageResponse,
  ISendMessagePayload,
  IStartChatPayload,
  IStartChatResponse,
  IVendor,
} from 'types';
import { dataExtractor, imageVideoPicker } from 'utils';

const useChatController = (props?: { chatId?: number }) => {
  const { chatId } = props || {};
  const navigation = useNavigation();
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [isMediaLoaading, setIsMediaLoading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{
    uri: string;
    type: 'image' | 'video';
    file: any;
  } | null>(null);

  const {
    data: messages,
    isPending: isMessagesLoading,
    refetch: refetchMessages,
  } = useQuery({
    queryFn: () => axiosInstance.get(`chats/${chatId}/messages`),
    queryKey: ['chat', chatId],
    enabled: !!chatId,
    staleTime: 0,
    refetchInterval: 5000,
  });

  const { mutateAsync, isPending: isStartChatLaoding } = useMutation({
    mutationFn: (data: IStartChatPayload) => ChatApis.startChat(data),
  });

  const { mutateAsync: sendMessageReq, isPending: isSendMessageLoading } =
    useMutation({
      mutationFn: (data: any) => ChatApis.sendMessage(chatId!, data),
    });

  useEffect(() => {
    if (messages) {
      const extractedData = dataExtractor<IMessageResponse[]>(messages);
      const formattedMessages = messagesMapper(extractedData);
      formattedMessages?.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
      setMessagesList(formattedMessages || []);
    }
  }, [messages]);

  const messagesMapper = (data: IMessageResponse[]) => {
    return data?.map(item => ({
      _id: item.id,
      text: item.message,
      createdAt: new Date(item.created_at),
      user: {
        _id: item?.sender_id,
        //   name: `${user?.first_name} ${user?.last_name}`,
        //   avatar: user?.profile_picture,
      },
      image:
        item?.file_type?.includes('jpg') ||
        item?.file_type?.includes('png') ||
        item?.file_type?.includes('jpeg') ||
        item?.file_type?.includes('heic') ||
        item?.file_type?.includes('image')
          ? item.file_path
          : null,
      video:
        item?.file_type?.includes('mp4') ||
        item?.file_type?.includes('mov') ||
        item?.file_type?.includes('video')
          ? item.file_path
          : null,
    }));
  };

  const startChatWithVendor = async (data: {
    serviceId: number;
    vendor: IVendor;
  }) => {
    const { serviceId, vendor } = data;
    try {
      const res = await mutateAsync({
        service_id: serviceId,
        vendor_id: vendor?.id,
      });
      const ChatData = dataExtractor<IStartChatResponse>(res);
      navigation.navigate('Chat', {
        chatId: ChatData?.id,
        vendor: vendor,
      });
    } catch (error) {}
  };

  const sendMessage = async (data: ISendMessagePayload) => {
    try {
      const formData = new FormData();
      if (data.message) {
        formData.append('message', data.message);
      }
      if (data.file) {
        formData.append('file', {
          uri: data.file.uri,
          type: data.file.type?.includes('image') ? 'image' : 'video',
          name: data.file.fileName,
        });
      }
      setIsMediaLoading(true);

      await sendMessageReq(formData);
    } catch (error) {
    } finally {
      setIsMediaLoading(false);
    }
  };

  const pickMedia = async () => {
    try {
      const result = await imageVideoPicker({
        selectionLimit: 1,
      });

      if (result?.assets && result?.assets?.length > 0) {
        const file = result.assets[0];
        const isVideo =
          file.type?.includes('video') ||
          file.type?.includes('mp4') ||
          file.type?.includes('mov');

        setPreviewMedia({
          uri: file.uri!,
          type: isVideo ? 'video' : 'image',
          file: file,
        });
      }
    } catch (error) {
      console.log('Error picking media:', error);
    }
  };

  const confirmSendMedia = async (messageText?: string) => {
    if (previewMedia) {
      await sendMessage({
        message: messageText,
        file: previewMedia.file,
      });
      setPreviewMedia(null);
    }
  };

  const cancelPreview = () => {
    setPreviewMedia(null);
  };

  return {
    startChatWithVendor,
    isStartChatLaoding,
    isMessagesLoading,
    sendMessage,
    messagesList,
    setMessagesList,
    pickMedia,
    isMediaLoaading,
    previewMedia,
    confirmSendMedia,
    cancelPreview,
  };
};

export default useChatController;
