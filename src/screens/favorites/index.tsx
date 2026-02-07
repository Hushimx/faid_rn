import { Box } from 'common';
import {
  AppHeader,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  CategoryItem,
  CategoryItemSkeleton,
} from 'components';
import { LoadingErrorFlatListHandler } from 'hoc';
import { useFavoritesController } from 'hooks';
import { useTranslation } from 'react-i18next';

const Favorites = () => {
  const { t } = useTranslation();
  const {
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
    removeFavorite,
  } = useFavoritesController();

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppSpaceWrapper>
        <AppHeader label={t('myFavorites')} />
        <AppSpacer variant="sm" />

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
          ListEmptyComponent={() => (
            <Box alignItems="center" justifyContent="center" marginTop="xxl">
              <AppText color="primary" variant="h6">
                {t('noFavorites')}
              </AppText>
            </Box>
          )}
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
              showFavoriteButton
              isFavorited
              onFavoritePress={removeFavorite}
            />
          )}
        />
      </AppSpaceWrapper>
    </Box>
  );
};

export default Favorites;
