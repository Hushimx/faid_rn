import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import ChatApis from 'services/chat';
import { IChat, QUERIES_KEY_ENUM } from 'types';
import { dataExtractor } from 'utils';
import { useAuthStore } from 'store';

export const useChatsController = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();

  const {
    data,
    isError,
    refetch,
    error,
    isPending,
    isRefetching,
    isFetching,
  } = useQuery({
    queryFn: () => ChatApis.getChats(),
    queryKey: [QUERIES_KEY_ENUM.chats],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const chats = dataExtractor<IChat[]>(data) || [];

  const onChatPress = (chat: IChat) => {
    // Determine which user to show based on current user type
    const otherUser = user?.type === 'vendor' ? chat.user : chat.vendor;
    
    if (otherUser) {
      navigation.navigate('Chat', {
        vendor: otherUser,
        chatId: chat.id,
      });
    }
  };

  return {
    chats,
    isError,
    error,
    isLoading: isPending,
    isRefetching,
    isFetching,
    refetch,
    onChatPress,
  };
};







