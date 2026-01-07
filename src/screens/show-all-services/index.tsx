import { useInfiniteQuery } from '@tanstack/react-query';
import { Box, SPACING } from 'common';
import {
  AppHeader,
  AppSpacer,
  AppSpaceWrapper,
  ServiceItem,
  ServiceItemSkeleton,
  ServiceSectionTilte,
} from 'components';
import { LoadingErrorFlatListHandler } from 'hoc';
import { useDebounce, useMemoizedData } from 'hooks';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HomeApis } from 'services';
import { ICategory, QUERIES_KEY_ENUM } from 'types';
import { dataExtractor, metaExtractor } from 'utils';

const ShowAllServices = () => {
  const [search, setSearch] = useState('');
  const debounceValue = useDebounce(search);
  const { t } = useTranslation();

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
      HomeApis.getCategories({
        currentPage: pageParam,
        search: debounceValue,
      } as any),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const meta = metaExtractor(lastPage);
      return meta?.has_more ? (meta?.current_page || 0) + 1 : undefined;
    },
    queryKey: [QUERIES_KEY_ENUM.categories, debounceValue],
  });

  const allData = useMemoizedData<ICategory>(data);

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppSpaceWrapper>
        <AppHeader isIncludesSearch value={search} onChangeText={setSearch} />
        <AppSpacer variant="sm" />
        <Box>
          <ServiceSectionTilte title={t('services')} />
          <AppSpacer variant="sm" />
        </Box>
        <LoadingErrorFlatListHandler
          data={allData}
          isError={isError}
          errorMessage={error?.message}
          refetch={refetch}
          loading={isPending}
          isRefetching={isRefetching}
          isFetching={isFetching || isFetchingNextPage}
          numColumns={3}
          columnWrapperStyle={{
            gap: SPACING.gap,
            justifyContent: allData?.length > 1 ? 'space-evenly' : 'flex-start',
          }}
          skeletonComponent={ServiceItemSkeleton}
          skeletonCount={9}
          onEndReached={
            hasNextPage && !isFetchingNextPage
              ? () => fetchNextPage()
              : undefined
          }
          renderItem={({ item }) => (
            <ServiceItem
              name={item?.name}
              imageUrl={item?.image_url}
              categoryId={item?.id}
              categoryName={item?.name}
            />
          )}
        />
      </AppSpaceWrapper>
    </Box>
  );
};

export default ShowAllServices;
