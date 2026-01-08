import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosInstance } from 'config';
import { useEffect, useRef, useState } from 'react';
import ChatApis from 'services/chat';
import {
  IMessageResponse,
  ISendMessagePayload,
  IStartChatPayload,
  IStartChatResponse,
  IVendor,
} from 'types';
import { dataExtractor, imageVideoPicker } from 'utils';
import { LatLng } from 'react-native-maps';
import { IModalRef } from 'types';
import { useAuthStore } from 'store';

const useChatController = (props?: { chatId?: number }) => {
  const { chatId } = props || {};
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [isMediaLoaading, setIsMediaLoading] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<Set<string>>(new Set());
  const pendingMessageTimestampsRef = useRef<Map<string, number>>(new Map());
  const [previewMedia, setPreviewMedia] = useState<{
    uri: string;
    type: 'image' | 'video';
    file: any;
  } | null>(null);
  const mapModalRef = useRef<IModalRef>(null);
  
  const MIN_LOADING_TIME = 1000; // Minimum 1 second loading time

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
      onSuccess: () => {
        // Refetch messages after sending to get the actual message
        refetchMessages();
      },
    });

  useEffect(() => {
    if (messages) {
      const extractedData = dataExtractor<IMessageResponse[]>(messages);
      const formattedMessages = messagesMapper(extractedData);
      formattedMessages?.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
      
      // Get current pending messages before updating
      setMessagesList(prev => {
        const stillPending: any[] = [];
        const pendingToRemove = new Set<string>();
        
        // Check each pending message to see if it's been confirmed
        prev.forEach(pendingMsg => {
          if (pendingMsg.pending) {
            const pendingId = String(pendingMsg._id);
            const timestamp = pendingMessageTimestampsRef.current.get(pendingId) || pendingMsg.createdAt.getTime();
            const elapsed = Date.now() - timestamp;
            
            // Check if there's a matching new message
            const isConfirmed = formattedMessages.some(newMsg => {
              // Match location messages by coordinates
              if (pendingMsg.location && newMsg.location) {
                const latMatch = Math.abs(pendingMsg.location.latitude - newMsg.location.latitude) < 0.0001;
                const lngMatch = Math.abs(pendingMsg.location.longitude - newMsg.location.longitude) < 0.0001;
                if (latMatch && lngMatch && newMsg.user._id === user?.id) {
                  return true;
                }
              }
              // Match image/video messages by checking if there's a new message from current user
              // with the same type (image or video) that was created recently (within last 10 seconds)
              if ((pendingMsg.image || pendingMsg.video) && (newMsg.image || newMsg.video)) {
                const sameType = (pendingMsg.image && newMsg.image) || (pendingMsg.video && newMsg.video);
                const isRecent = Math.abs(newMsg.createdAt.getTime() - pendingMsg.createdAt.getTime()) < 10000;
                if (sameType && isRecent && newMsg.user._id === user?.id) {
                  return true;
                }
              }
              return false;
            });
            
            if (!isConfirmed) {
              // Check if pending message is too old (more than 30 seconds) - remove it
              if (elapsed > 30000) {
                pendingToRemove.add(pendingId);
              } else {
                stillPending.push(pendingMsg);
              }
            } else {
              // Message is confirmed, but ensure minimum loading time has passed
              if (elapsed >= MIN_LOADING_TIME) {
                pendingToRemove.add(pendingId);
              } else {
                // Keep showing loading until minimum time has passed
                stillPending.push(pendingMsg);
                // Schedule removal after minimum time
                setTimeout(() => {
                  setPendingMessages(prevPending => {
                    const updated = new Set(prevPending);
                    updated.delete(pendingId);
                    return updated;
                  });
                  pendingMessageTimestampsRef.current.delete(pendingId);
                  setMessagesList(prevList => prevList.filter(m => m._id !== pendingId));
                }, MIN_LOADING_TIME - elapsed);
              }
            }
          }
        });
        
        // Update pending messages set and timestamps
        setPendingMessages(prevPending => {
          const updated = new Set(prevPending);
          pendingToRemove.forEach(id => updated.delete(id));
          return updated;
        });
        pendingToRemove.forEach(id => pendingMessageTimestampsRef.current.delete(id));
        
        // Merge formatted messages with still-pending messages
        // Remove duplicates by _id
        const messageMap = new Map();
        [...formattedMessages, ...stillPending].forEach(msg => {
          messageMap.set(String(msg._id), msg);
        });
        
        return Array.from(messageMap.values()).sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
      });
    }
  }, [messages, user?.id]);

  const messagesMapper = (data: IMessageResponse[]) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => {
      if (!item || !item.id) return null;
      
      try {
        // For location messages, don't show text (like WhatsApp)
        const isLocationMessage = item?.message_type === 'location' && item.latitude && item.longitude;
        const lat = item.latitude ? parseFloat(String(item.latitude)) : null;
        const lng = item.longitude ? parseFloat(String(item.longitude)) : null;
        const hasValidLocation = isLocationMessage && lat !== null && !isNaN(lat) && lng !== null && !isNaN(lng);
        
        return {
          _id: item.id,
          // For location messages, use empty string instead of undefined (GiftedChat expects string)
          text: hasValidLocation ? '' : (item.message || ''),
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
          location: hasValidLocation
            ? {
                latitude: lat!,
                longitude: lng!,
              }
            : null,
        };
      } catch (error) {
        console.error('Error mapping message:', error, item);
        return null;
      }
    }).filter(Boolean) as any[];
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
    let loadingMessageId: string | null = null;
    try {
      // Handle location messages - send only coordinates, no text (like WhatsApp)
      if (data.location) {
        // Create loading message for location
        loadingMessageId = `pending-location-${Date.now()}`;
        const loadingMessage = {
          _id: loadingMessageId,
          text: '',
          createdAt: new Date(),
          user: { _id: user?.id! },
          location: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
          },
          pending: true,
        };
        const timestamp = Date.now();
        setPendingMessages(prev => new Set(prev).add(loadingMessageId));
        pendingMessageTimestampsRef.current.set(loadingMessageId, timestamp);
        setMessagesList(prev => [loadingMessage, ...prev]);
        
        await sendMessageReq({
          latitude: data.location.latitude,
          longitude: data.location.longitude,
        });
        return;
      }
      
      // Only use FormData if there's a file, otherwise send as JSON
      if (data.file) {
        // Get file properties - handle both Asset type and plain object
        const fileUri = data.file.uri || (data.file as any).uri;
        const fileType = data.file.type || (data.file as any).type || '';
        const isVideo = fileType?.includes('video') || fileType?.includes('mp4') || fileType?.includes('mov');
        
        // Create loading message for image/video
        loadingMessageId = `pending-${isVideo ? 'video' : 'image'}-${Date.now()}`;
        const loadingMessage: any = {
          _id: loadingMessageId,
          text: data.message || '',
          createdAt: new Date(),
          user: { _id: user?.id! },
          pending: true,
        };
        
        if (isVideo) {
          loadingMessage.video = fileUri;
        } else {
          loadingMessage.image = fileUri;
        }
        
        const timestamp = Date.now();
        setPendingMessages(prev => new Set(prev).add(loadingMessageId));
        pendingMessageTimestampsRef.current.set(loadingMessageId, timestamp);
        setMessagesList(prev => [loadingMessage, ...prev]);
        
        const formData = new FormData();
        if (data.message) {
          formData.append('message', data.message);
        }
        
        const fileFileName = data.file.fileName || (data.file as any).fileName;
        
        if (!fileUri) {
          console.error('File URI is missing');
          throw new Error('File URI is required');
        }
        
        // Determine proper MIME type
        let mimeType = 'image/jpeg'; // default
        if (fileType) {
          if (fileType.includes('image')) {
            // Determine specific image type
            if (fileType.includes('png')) {
              mimeType = 'image/png';
            } else if (fileType.includes('jpeg') || fileType.includes('jpg')) {
              mimeType = 'image/jpeg';
            } else if (fileType.includes('heic') || fileType.includes('heif')) {
              mimeType = 'image/heic';
            } else {
              // Use the type as-is if it's already a valid MIME type
              mimeType = fileType.includes('/') ? fileType : `image/${fileType}`;
            }
          } else if (fileType.includes('video')) {
            // Determine specific video type
            if (fileType.includes('mp4')) {
              mimeType = 'video/mp4';
            } else if (fileType.includes('mov')) {
              mimeType = 'video/quicktime';
            } else {
              mimeType = fileType.includes('/') ? fileType : `video/${fileType}`;
            }
          } else if (fileType.includes('/')) {
            // Already a MIME type
            mimeType = fileType;
          }
        }

        // Generate filename with proper extension
        let fileName = fileFileName || 'file';
        // Remove any path separators from filename
        fileName = fileName.split('/').pop() || fileName;
        fileName = fileName.split('\\').pop() || fileName;
        
        if (!fileName.includes('.')) {
          // Add extension based on MIME type
          if (mimeType.includes('png')) {
            fileName = `${fileName}.png`;
          } else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
            fileName = `${fileName}.jpg`;
          } else if (mimeType.includes('heic')) {
            fileName = `${fileName}.heic`;
          } else if (mimeType.includes('mp4')) {
            fileName = `${fileName}.mp4`;
          } else if (mimeType.includes('quicktime') || mimeType.includes('mov')) {
            fileName = `${fileName}.mov`;
          }
        }

        // Handle Android URI format - React Native FormData handles content:// URIs correctly
        // But we need to ensure the URI is in the right format
        let finalUri = fileUri;
        // On Android, content:// URIs work directly with FormData
        // file:// URIs also work, but we should keep them as-is
        
        // Create the file object for FormData
        const fileObject = {
          uri: finalUri,
          type: mimeType,
          name: fileName,
        };
        
        console.log('Uploading file:', {
          uri: finalUri.substring(0, 50) + '...',
          type: mimeType,
          name: fileName,
        });
        
        formData.append('file', fileObject as any);
        
        setIsMediaLoading(true);
        await sendMessageReq(formData);
      } else {
        // Send text-only message as JSON
        await sendMessageReq({
          message: data.message,
        });
      }
    } catch (error) {
      console.log('Error sending message:', error);
      // Remove loading message on error
      if (loadingMessageId) {
        setPendingMessages(prev => {
          const updated = new Set(prev);
          updated.delete(loadingMessageId);
          return updated;
        });
        pendingMessageTimestampsRef.current.delete(loadingMessageId);
        setMessagesList(prev => prev.filter(m => m._id !== loadingMessageId));
      }
      throw error; // Re-throw to let the UI handle it
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

  const pickFromCamera = async () => {
    try {
      const { launchCamera } = await import('react-native-image-picker');
      const result = await launchCamera({
        mediaType: 'mixed',
        quality: 0.8,
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
      console.log('Error picking from camera:', error);
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

  const openLocationPicker = () => {
    mapModalRef.current?.openModal();
  };

  const handleLocationSelect = async (location: LatLng & { address?: string }) => {
    try {
      // Send location only - no text message, just like WhatsApp
      await sendMessage({
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
        },
      });
    } catch (error) {
      console.log('Error sending location:', error);
    }
  };

  return {
    startChatWithVendor,
    isStartChatLaoding,
    isMessagesLoading,
    pickFromCamera,
    sendMessage,
    messagesList,
    setMessagesList,
    pickMedia,
    isMediaLoaading,
    previewMedia,
    confirmSendMedia,
    cancelPreview,
    openLocationPicker,
    mapModalRef,
    handleLocationSelect,
  };
};

export default useChatController;
