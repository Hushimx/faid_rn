import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import { NotificationsApis } from 'services';
import { INotification, QUERIES_KEY_ENUM } from 'types';
import { dataExtractor, metaExtractor, ShowSnackBar } from 'utils';
import { useTranslation } from 'react-i18next';
import useMemoizedData from 'hooks/useMemoizedData';
import { useNavigation } from '@react-navigation/native';
import { useReadNotification } from 'hooks/useReadNotification';

export const useNotificationsController = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

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
    queryFn: ({ pageParam = 1 }) =>
      NotificationsApis.getNotifications({
        currentPage: pageParam,
        per_page: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const meta = metaExtractor(lastPage);
      return meta?.has_more ? (meta?.current_page || 0) + 1 : undefined;
    },
    queryKey: [QUERIES_KEY_ENUM.notifications],
  });

  const { readNotification } = useReadNotification();

  const allData = useMemoizedData(
    data,
    page => dataExtractor<{ data: INotification }>(page)?.data,
  );

  const unreadCount = useMemo(
    () => allData.filter(notification => !notification.read_at).length,
    [allData],
  );

  // Mark single notification as read
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      NotificationsApis.markAsRead(notificationId),
  });

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: () => NotificationsApis.markAllAsRead(),
  });

  const handleMarkAsRead = async (notificationId: string) => {
    readNotification(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount > 0) {
      try {
        await markAllAsReadMutation.mutateAsync();
        refetch();
      } catch (e) {}
    }
  };
  const onNotificationPress = ({
    serviceId,
    read_at,
    id,
  }: Pick<INotification, 'id' | 'read_at'> & { serviceId: number }) => {
    if (serviceId)
      navigation.navigate('ServiceDetails', {
        serviceId,
      });
    if (!!!read_at) handleMarkAsRead(id);
  };

  return {
    allData,
    isError,
    error,
    isLoading: isPending,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    onNotificationPress,
  };
};
