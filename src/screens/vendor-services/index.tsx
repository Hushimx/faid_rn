import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Box } from 'common';
import { AppHeader, AppSpaceWrapper, CategoryItem } from 'components';
import { LoadingErrorFlatListHandler } from 'hoc';
import { useDebounce, useMemoizedData } from 'hooks';
import { useMemo, useState } from 'react';
import { ServicesApis } from 'services';
import { useAuthStore } from 'store';
import { IServiceResponse, QUERIES_KEY_ENUM, RootStackParamList } from 'types';
import { dataExtractor, metaExtractor } from 'utils';

const VendorServices = (
  props: NativeStackScreenProps<RootStackParamList, 'VendorServices'>,
) => {
  const [search, setSearch] = useState('');
  const debounceValue = useDebounce(search);
  const { user } = useAuthStore();
  const vendorId = user?.id!;

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
        vendorId,
        currentPage: pageParam,
        search: debounceValue,
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const meta = metaExtractor(lastPage);
      return meta?.has_more ? (meta?.current_page || 0) + 1 : undefined;
    },
    queryKey: [QUERIES_KEY_ENUM.vendor_services, vendorId, debounceValue],
  });

  const allData = useMemoizedData<IServiceResponse>(data);

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppSpaceWrapper>
        <AppHeader isIncludesSearch value={search} onChangeText={setSearch} />
        {/* <AppSpacer variant="sm" /> */}

        <LoadingErrorFlatListHandler
          data={allData}
          isError={isError}
          errorMessage={error?.message}
          refetch={refetch}
          loading={isPending}
          isRefetching={isRefetching}
          isFetching={isFetching || isFetchingNextPage}
          onEndReached={
            hasNextPage && !isFetchingNextPage
              ? () => fetchNextPage()
              : undefined
          }
          renderItem={({ item, index }) => (
            <CategoryItem
              index={index}
              title={item?.title}
              userName={item?.vendor?.name}
              serviceId={item?.id}
              price={item?.price}
              vendorId={item?.vendor?.id}
              vendorImageUrl={item?.vendor?.profile_picture}
              imageUrl={item?.primary_image?.url}
              reviewCount={item?.reviews_count}
              rating={item?.rating}
              city={item?.city}
            />
          )}
        />
      </AppSpaceWrapper>
    </Box>
  );
};

export default VendorServices;
