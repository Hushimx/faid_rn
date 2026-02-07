import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemoizedData } from 'hooks';
import { ServicesApis } from 'services';
import { QUERIES_KEY_ENUM } from 'types';
import { dataExtractor, metaExtractor } from 'utils';

export const useFavoritesController = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isError,
    refetch,
    error,
    isPending: isLoading,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      ServicesApis.getFavorites({
        page: pageParam,
        per_page: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const meta = metaExtractor(lastPage);
      return meta?.has_more ? (meta?.current_page || 0) + 1 : undefined;
    },
    queryKey: [QUERIES_KEY_ENUM.favorites],
  });

  const allData = useMemoizedData(data, page => dataExtractor(page) ?? []);

  const removeFavoriteMutation = useMutation({
    mutationFn: (serviceId: number) => ServicesApis.removeFavorite(serviceId),
    onSuccess: (_, serviceId) => {
      queryClient.invalidateQueries({ queryKey: [QUERIES_KEY_ENUM.favorites] });
      queryClient.invalidateQueries({
        queryKey: [QUERIES_KEY_ENUM.service_details, serviceId],
      });
    },
  });

  const handleRemoveFavorite = (serviceId: number) => {
    removeFavoriteMutation.mutate(serviceId);
  };

  return {
    allData,
    isError,
    error,
    isLoading,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
    removeFavorite: handleRemoveFavorite,
    isRemovingFavorite: removeFavoriteMutation.isPending,
  };
};
