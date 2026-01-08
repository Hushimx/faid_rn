import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import TicketApis from 'services/tickets';
import {
  ITicket,
  ITicketMessage,
  ISendTicketMessagePayload,
  QUERIES_KEY_ENUM,
} from 'types';
import { dataExtractor, ShowSnackBar, imageVideoPicker } from 'utils';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from 'store';
import { useNavigation } from '@react-navigation/native';

export const useTicketDetailController = (ticketId: number) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ITicketMessage[]>([]);
  const [previewMedia, setPreviewMedia] = useState<{
    uri: string;
    type: 'image' | 'video';
    file: any;
  } | null>(null);
  const [isMediaLoading, setIsMediaLoading] = useState(false);

  const {
    data: ticketData,
    isPending: isTicketLoading,
    refetch: refetchTicket,
  } = useQuery({
    queryFn: () => TicketApis.getTicket(ticketId),
    queryKey: [QUERIES_KEY_ENUM.tickets, ticketId],
    enabled: !!ticketId,
  });

  const {
    data: messagesData,
    isPending: isMessagesLoading,
    refetch: refetchMessages,
  } = useQuery({
    queryFn: () => TicketApis.getTicketMessages(ticketId),
    queryKey: [QUERIES_KEY_ENUM.ticket_messages, ticketId],
    enabled: !!ticketId,
    refetchInterval: 3000, // Refetch every 3 seconds for faster updates
    staleTime: 0, // Always consider data stale to ensure fresh fetches
  });

  const ticket = dataExtractor<ITicket>(ticketData);

  useEffect(() => {
    if (messagesData) {
      const fetchedMessages = dataExtractor<ITicketMessage[]>(messagesData) || [];
      // Sort messages by created_at (newest first) for inverted list display
      // With inverted={true}, newest messages will appear at the bottom
      const sortedMessages = [...fetchedMessages].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; // Newest first (will appear at bottom with inverted)
      });
      setMessages(sortedMessages);
    }
  }, [messagesData]);

  const sendMessageMutation = useMutation({
    mutationFn: async (data: ISendTicketMessagePayload) => {
      try {
        console.log('Sending ticket message:', {
          ticketId,
          userId: user?.id,
          messageLength: data.message?.length,
          hasAttachment: !!data.attachment,
        });
        const response = await TicketApis.sendTicketMessage(
          ticketId,
          data,
          user?.id || 0,
        );
        console.log('Message sent successfully:', response);
        return response;
      } catch (error: any) {
        console.error('Error sending ticket message:', {
          error: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
          ticketId,
          userId: user?.id,
        });
        throw error;
      }
    },
    onSuccess: async (response) => {
      console.log('Message sent successfully, response:', response);
      
      // Optimistically add the new message to the list immediately
      const newMessage = dataExtractor<ITicketMessage>(response);
      if (newMessage) {
        console.log('Adding new message optimistically:', newMessage);
        setMessages(prev => {
          const updated = [...prev, newMessage];
          // Sort by created_at (newest first) for inverted list
          return updated.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA; // Newest first (will appear at bottom with inverted)
          });
        });
      }
      
      // Invalidate and refetch to get the complete updated list
      await queryClient.invalidateQueries({
        queryKey: [QUERIES_KEY_ENUM.ticket_messages, ticketId],
      });
      await queryClient.invalidateQueries({
        queryKey: [QUERIES_KEY_ENUM.tickets, ticketId],
      });
      
      // Refetch after a short delay to ensure server has processed
      setTimeout(async () => {
        const [messagesResult, ticketResult] = await Promise.all([
          refetchMessages(),
          refetchTicket(),
        ]);
        console.log('Messages and ticket refetched successfully', {
          messagesCount: messagesResult.data ? dataExtractor<ITicketMessage[]>(messagesResult.data)?.length : 0,
        });
      }, 500);
    },
    onError: (error: any) => {
      let errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        t('error');
      
      // Handle rate limiting (429)
      if (error?.response?.status === 429 || error?.message?.includes('Rate limit')) {
        const retryAfter = error?.response?.data?.errors?.retry_after?.[0] || 
                          error?.response?.data?.errors?.retry_after;
        if (retryAfter) {
          // Convert seconds to hours/minutes
          const hours = Math.floor(retryAfter / 3600);
          const minutes = Math.ceil((retryAfter % 3600) / 60);
          
          if (hours > 0) {
            errorMessage = `You've sent too many messages. Please wait ${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` and ${minutes} minute${minutes > 1 ? 's' : ''}` : ''} before trying again.`;
          } else if (minutes > 0) {
            errorMessage = `You've sent too many messages. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`;
          } else {
            errorMessage = `You've sent too many messages. Please wait ${retryAfter} second${retryAfter > 1 ? 's' : ''} before trying again.`;
          }
        } else {
          errorMessage = error?.response?.data?.message || 
                        'You\'ve sent too many messages. Please wait before trying again.';
        }
      }
      
      console.error('Message send error:', {
        error: errorMessage,
        fullError: error,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      
      // Show error to user (including rate limit errors)
      ShowSnackBar(errorMessage, 'danger');
    },
  });

  const updateTicketMutation = useMutation({
    mutationFn: (status: 'open' | 'closed') =>
      TicketApis.updateTicket(ticketId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERIES_KEY_ENUM.tickets],
      });
      refetchTicket();
      ShowSnackBar(t('ticketUpdatedSuccessfully'), 'success');
    },
    onError: (error: any) => {
      ShowSnackBar(
        error?.response?.data?.message || error?.message || t('error'),
        'danger',
      );
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: () => TicketApis.markTicketMessagesAsRead(ticketId),
    onSuccess: () => {
      refetchMessages();
      refetchTicket();
    },
  });

  useEffect(() => {
    if (ticket && messages.length > 0) {
      // Mark messages as read when viewing
      markAsReadMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId, messages.length]);

  const sendMessage = async (data: ISendTicketMessagePayload) => {
    console.log('sendMessage called:', {
      ticketId,
      messageLength: data.message?.length,
      messageText: data.message,
      ticketStatus: ticket?.status,
      userId: user?.id,
      hasAttachment: !!data.attachment,
    });

    // Require either message or attachment (allow attachment-only)
    const hasMessage = data.message && data.message.trim().length > 0;
    const hasAttachment = !!data.attachment;
    
    if (!hasMessage && !hasAttachment) {
      console.warn('Neither message nor attachment provided');
      ShowSnackBar('Either message or attachment is required', 'danger');
      return;
    }

    if (!user?.id) {
      console.error('User ID is missing');
      ShowSnackBar('Please login to send messages', 'danger');
      return;
    }

    if (ticket?.status === 'closed') {
      console.warn('Attempted to send message to closed ticket');
      ShowSnackBar(t('cannotSendMessageToClosedTicket'), 'danger');
      return;
    }

    try {
      console.log('Calling sendMessageMutation.mutateAsync...', {
        message: data.message || '',
        hasAttachment: !!data.attachment,
      });
      const result = await sendMessageMutation.mutateAsync(data);
      console.log('sendMessageMutation completed successfully', result);
      // Clear preview after successful send
      if (previewMedia) {
        setPreviewMedia(null);
      }
    } catch (error: any) {
      console.error('Error in sendMessage:', {
        error: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        fullError: error,
      });
      
      // Show error to user immediately
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to send message. Please try again.';
      ShowSnackBar(errorMessage, 'danger');
      
      // Re-throw to trigger onError handler
      throw error;
    }
  };

  const pickMedia = async () => {
    try {
      setIsMediaLoading(true);
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
    } finally {
      setIsMediaLoading(false);
    }
  };

  const confirmSendMedia = async (messageText?: string) => {
    if (previewMedia) {
      // Format attachment to match service expectations
      // The file object from imageVideoPicker has uri, type, fileName
      const attachment = {
        uri: previewMedia.file.uri || previewMedia.uri,
        type: previewMedia.file.type || (previewMedia.type === 'video' ? 'video/mp4' : 'image/jpeg'),
        name: previewMedia.file.fileName || previewMedia.file.uri?.split('/').pop() || (previewMedia.type === 'video' ? 'video.mp4' : 'image.jpg'),
      };
      
      await sendMessage({
        message: messageText?.trim() || '',
        attachment: attachment,
      });
      setPreviewMedia(null);
    }
  };

  const cancelPreview = () => {
    setPreviewMedia(null);
  };

  const toggleTicketStatus = () => {
    if (!ticket) return;
    
    const newStatus = ticket.status === 'open' ? 'closed' : 'open';
    updateTicketMutation.mutate(newStatus);
  };

  return {
    ticket,
    messages,
    isTicketLoading,
    isMessagesLoading,
    sendMessage,
    isSending: sendMessageMutation.isPending,
    toggleTicketStatus,
    isUpdating: updateTicketMutation.isPending,
    refetch: refetchTicket,
    refetchMessages,
    pickMedia,
    previewMedia,
    confirmSendMedia,
    cancelPreview,
    isMediaLoading,
  };
};

