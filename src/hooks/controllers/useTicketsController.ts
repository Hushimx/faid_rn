import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import TicketApis from 'services/tickets';
import {
  IGetTicketsPayload,
  ITicket,
  QUERIES_KEY_ENUM,
  TicketStatus,
  TicketPriority,
} from 'types';
import { dataExtractor, metaExtractor, ShowSnackBar } from 'utils';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from 'store';
import useMemoizedData from 'hooks/useMemoizedData';
import { useState } from 'react';

export const useTicketsController = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState<TicketStatus | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<
    TicketPriority | undefined
  >();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data,
    isError,
    refetch,
    error,
    isPending,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await TicketApis.getTickets({
          currentPage: pageParam,
          per_page: 15,
          status: statusFilter,
          priority: priorityFilter,
          search: searchQuery || undefined,
        });
        return response;
      } catch (err: any) {
        console.error('Error fetching tickets:', err);
        console.error('Error response:', err?.response?.data);
        throw err;
      }
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      try {
        const meta = metaExtractor(lastPage);
        return meta?.has_more ? (meta?.current_page || 0) + 1 : undefined;
      } catch (err) {
        console.error('Error extracting meta:', err);
        return undefined;
      }
    },
    queryKey: [
      QUERIES_KEY_ENUM.tickets,
      statusFilter,
      priorityFilter,
      searchQuery,
    ],
  });

  const allTickets = useMemoizedData(
    data,
    page => {
      try {
        const extracted = dataExtractor<ITicket[]>(page);
        if (!Array.isArray(extracted)) {
          console.warn('Tickets data is not an array:', extracted);
          return [];
        }
        return extracted || [];
      } catch (error) {
        console.error('Error extracting tickets data:', error);
        return [];
      }
    },
  );

  const deleteTicketMutation = useMutation({
    mutationFn: (ticketId: number) => TicketApis.deleteTicket(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERIES_KEY_ENUM.tickets],
      });
      ShowSnackBar(t('ticketDeletedSuccessfully'), 'success');
    },
    onError: (error: any) => {
      ShowSnackBar(
        error?.response?.data?.message || error?.message || t('error'),
        'danger',
      );
    },
  });

  const onTicketPress = (ticket: ITicket) => {
    navigation.navigate('TicketDetail', {
      ticketId: ticket.id,
    });
  };

  const onCreateTicketPress = () => {
    navigation.navigate('CreateTicket');
  };

  return {
    tickets: allTickets,
    isError,
    error,
    isLoading: isPending,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    onTicketPress,
    onCreateTicketPress,
    deleteTicket: deleteTicketMutation.mutateAsync,
    isDeleting: deleteTicketMutation.isPending,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
  };
};

