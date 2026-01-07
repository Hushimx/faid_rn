import { Box } from 'common';
import {
  AppHeader,
  AppSpacer,
  AppSpaceWrapper,
  CategoriesModal,
  CategoryItem,
  CategoryItemSkeleton,
  PriceFilterModal,
  ServiceSectionTilte,
} from 'components';
import { LoadingErrorFlatListHandler } from 'hoc';
import { useShowAllForCategoryController } from 'hooks';
import { ScrollView } from 'react-native';

const ShowAllForCategory = () => {
  const {
    search,
    setSearch,
    selectedCategory,
    priceRange,
    onApplyPriceRange,
    categoriesModalRef,
    priceFilterModalRef,
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
    categoryName,
    onCategorySelect,
  } = useShowAllForCategoryController();

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppSpaceWrapper>
        <AppHeader
          isIncludesSearch
          value={search || ''}
          onChangeText={setSearch}
        />

        {categoryName && <ServiceSectionTilte title={categoryName} />}
        <AppSpacer variant="ss" />

        {!isLoading && (
          <Box minHeight={40}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Box flexDirection="row" alignItems="center">
                {!categoryName && (
                  <CategoriesModal
                    ref={categoriesModalRef}
                    onSelectCategory={onCategorySelect}
                    selectedCategory={selectedCategory}
                  />
                )}
                <PriceFilterModal
                  ref={priceFilterModalRef}
                  onApply={onApplyPriceRange}
                  currentPriceRange={priceRange}
                />
              </Box>
            </ScrollView>
            <AppSpacer variant="ss" />
          </Box>
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

export default ShowAllForCategory;
