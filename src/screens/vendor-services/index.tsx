import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box } from 'common';
import { AppHeader, AppSpaceWrapper, CategoryItem, CategoryItemSkeleton } from 'components';
import { LoadingErrorFlatListHandler } from 'hoc';
import { useDebounce, useMemoizedData } from 'hooks';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ServicesApis } from 'services';
import { useAuthStore } from 'store';
import { IServiceResponse, QUERIES_KEY_ENUM, RootStackParamList } from 'types';
import { metaExtractor, ShowSnackBar } from 'utils';

const VendorServices = (
  _props: NativeStackScreenProps<RootStackParamList, 'VendorServices'>,
) => {
  const [search, setSearch] = useState('');
  const debounceValue = useDebounce(search);
  const { user } = useAuthStore();
  const vendorId = user?.id!;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

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

  const { mutateAsync: deleteService } = useMutation({
    mutationFn: (serviceId: number) => ServicesApis.deleteService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERIES_KEY_ENUM.vendor_services, vendorId],
      });
      // Show success alert
      Alert.alert(
        t('serviceDeletedSuccessfully'),
        '',
        [
          {
            text: t('ok'),
            style: 'default',
          },
        ],
      );
      // Also show snackbar for additional feedback
      ShowSnackBar({
        text: t('serviceDeletedSuccessfully'),
        type: 'default',
      });
    },
    onError: (err: any) => {
      Alert.alert(
        t('failedToDeleteService'),
        err?.response?.data?.message || t('failedToDeleteService'),
        [
          {
            text: t('ok'),
            style: 'default',
          },
        ],
      );
      ShowSnackBar({
        text: err?.response?.data?.message || t('failedToDeleteService'),
        type: 'error',
      });
    },
  });

  const handleDelete = (serviceId: number) => {
    Alert.alert(
      t('deleteService'),
      t('deleteServiceConfirmation'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => deleteService(serviceId),
        },
      ],
    );
  };

  const allData = useMemoizedData<IServiceResponse>(data);

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppSpaceWrapper>
        <AppHeader label={t('myServices')} isIncludesSearch value={search} onChangeText={setSearch} />
        {/* <AppSpacer variant="sm" /> */}

        <LoadingErrorFlatListHandler
          data={allData}
          isError={isError}
          errorMessage={error?.message}
          refetch={refetch}
          loading={isPending}
          isRefetching={isRefetching}
          isFetching={isFetching || isFetchingNextPage}
          skeletonComponent={CategoryItemSkeleton}
          skeletonCount={5}
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
              onDelete={handleDelete}
              showEditButton={true}
            />
          )}
        />
      </AppSpaceWrapper>
    </Box>
  );
};

export default VendorServices;
