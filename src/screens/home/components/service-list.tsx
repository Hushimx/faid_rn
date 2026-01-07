import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Box, SPACING } from 'common';
import { AppSpacer, CategoryItem, CategoryItemSkeleton, ServiceSectionTilte } from 'components';
import { LoadingErrorFlatListHandler } from 'hoc';
import { FC } from 'react';
import { ServicesApis } from 'services';
import { IServiceResponse, QUERIES_KEY_ENUM } from 'types';
import { dataExtractor, metaExtractor } from 'utils';

interface IProps {
  label: string;
  categoryId: number;
  categoryName: string;
  cityId?: number;
}

const ServiceList: FC<IProps> = ({
  label,
  categoryId,
  categoryName,
  cityId,
}) => {
  const navigation = useNavigation();
  const {
    data,
    isPending,
    isError,
    isLoadingError,
    error,
    refetch,
    isFetching,
  } = useQuery<any, any, { data: IServiceResponse[] }>({
    queryFn: () => ServicesApis.getServices({ categoryId, cityId }),
    queryKey: [QUERIES_KEY_ENUM.services, categoryId, cityId],
  });
  const DATA = dataExtractor<IServiceResponse[]>(data);
  const TOTAL = metaExtractor(data)?.total;
  const displayShowAll = TOTAL > DATA?.length;

  if (DATA?.length)
    return (
      <Box>
        {/* <AppSpacer variant="sm" /> */}
        <ServiceSectionTilte
          title={label}
          onShowAllPress={
            displayShowAll
              ? () =>
                  navigation.navigate('ShowAllForCategory', {
                    categoryId,
                    categoryName,
                  })
              : undefined
          }
        />
        <AppSpacer variant="ss" />
        <LoadingErrorFlatListHandler
          loading={isPending || isFetching}
          refetch={refetch}
          isError={isError || isLoadingError}
          errorMessage={error?.message}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ 
            gap: SPACING.gap,
            paddingHorizontal: SPACING.gap,
          }}
          decelerationRate="fast"
          bounces={false}
          data={DATA}
          skeletonComponent={CategoryItemSkeleton}
          skeletonCount={3}
          renderItem={({ item, index }) => (
            <CategoryItem
              index={index}
              title={item?.title}
              userName={item?.vendor?.name}
              price={item?.price}
              serviceId={item?.id}
              vendorId={item?.vendor?.id}
              imageUrl={item?.primary_image?.url}
              reviewCount={item?.reviews_count}
              rating={item?.rating}
              vendorImageUrl={item?.vendor?.profile_picture}
              style={{ maxWidth: SPACING.xxl * 2 }}
              city={item?.city}
            />
          )}
        />
      </Box>
    );
};
export default ServiceList;
