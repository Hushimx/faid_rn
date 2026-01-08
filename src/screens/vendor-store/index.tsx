import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box } from 'common';
import {
  AppHeader,
  AppSpacer,
  AppSpaceWrapper,
  CategoryItem,
  CategoryItemSkeleton,
  UserAvatar,
} from 'components';
import { AppText } from 'components/atoms';
import { LoadingErrorFlatListHandler } from 'hoc';
import { useVendorStoreController } from 'hooks';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from 'types';

const VendorStore = (
  _props: NativeStackScreenProps<RootStackParamList, 'VendorStore'>,
) => {
  const { t } = useTranslation();
  const {
    search,
    setSearch,
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
  } = useVendorStoreController();

  // Get vendor info from first service (if available)
  const vendor = allData?.[0]?.vendor;
  const vendorName = vendor?.name || '';
  const vendorImage = vendor?.profile_picture;

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppSpaceWrapper>
        <AppHeader
          label={vendorName || t('vendorStore')}
          isIncludesSearch
          value={search || ''}
          onChangeText={setSearch}
        />
        <AppSpacer variant="s" />

        {/* Vendor Info Header */}
        {vendor && (
          <>
            <Box
              flexDirection="row"
              alignItems="center"
              backgroundColor="white"
              borderRadius={10}
              padding="m"
              marginBottom="s"
            >
              <UserAvatar image={vendorImage} size="large" />
              <Box marginLeft="m" flex={1}>
                <AppText variant="h6" color="cutomBlack" fontWeight="700">
                  {vendorName}
                </AppText>
                <AppText color="customGray" marginTop="ss">
                  {t('serviceProvider')}
                </AppText>
              </Box>
            </Box>
            <AppSpacer variant="s" />
          </>
        )}

        <LoadingErrorFlatListHandler
          data={allData}
          isError={isError}
          errorMessage={error?.message}
          refetch={refetch}
          loading={isLoading}
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
            />
          )}
        />
      </AppSpaceWrapper>
    </Box>
  );
};

export default VendorStore;


