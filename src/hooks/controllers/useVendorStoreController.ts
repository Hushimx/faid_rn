import { RouteProp, useRoute } from '@react-navigation/native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce, useMemoizedData } from 'hooks';
import { useState } from 'react';
import { ServicesApis } from 'services';
import {
  IServiceResponse,
  QUERIES_KEY_ENUM,
  RootStackParamList,
} from 'types';
import { metaExtractor } from 'utils';

type VendorStoreRouteProp = RouteProp<RootStackParamList, 'VendorStore'>;

export const useVendorStoreController = () => {
  const route = useRoute<VendorStoreRouteProp>();
  const { vendorId } = route.params || {};

  const [search, setSearch] = useState('');
  const debounceValue = useDebounce(search);

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
      ServicesApis.getVendorServices({
        vendorId: vendorId!,
        currentPage: pageParam,
        search: debounceValue,
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const meta = metaExtractor(lastPage);
      return meta?.has_more ? (meta?.current_page || 0) + 1 : undefined;
    },
    queryKey: [QUERIES_KEY_ENUM.vendor_services, vendorId, debounceValue],
    enabled: !!vendorId,
  });

  const allData = useMemoizedData<IServiceResponse[]>(data);

  return {
    search,
    setSearch,
    vendorId,
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
  };
};


