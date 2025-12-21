import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationsApis } from 'services';
import { QUERIES_KEY_ENUM } from 'types';

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => NotificationsApis.markAsRead(id),
  });

  const readNotification = async (id: string) => {
    try {
      await mutateAsync(id);
      await queryClient.invalidateQueries({
        queryKey: [QUERIES_KEY_ENUM.notifications],
      });
    } catch (error) {
      console.error('Error reading notification:', error);
    }
  };

  return {
    readNotification,
    isLoading: isPending,
  };
};
