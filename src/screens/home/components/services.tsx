import { Box, SPACING } from 'common';
import { AppSpacer, ServiceItem } from 'components';
import { LoadingErrorFlatListHandler } from 'hoc';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IService } from 'types';
import ServiceSectionTilte from '../../../components/sections/service-section-title';
import { useNavigation } from '@react-navigation/native';

const Services: FC<IService> = ({
  categories,
  isLoading,
  errorMessage,
  refetch,
  displayIsShowAll,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <Box>
      <ServiceSectionTilte
        title={t('services')}
        onShowAllPress={
          displayIsShowAll
            ? () => navigation.navigate('ShowAllServices')
            : undefined
        }
      />
      <AppSpacer variant="s" />

      <LoadingErrorFlatListHandler
        loading={isLoading}
        refetch={refetch}
        isError={false}
        errorMessage={errorMessage}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: SPACING.gap }}
        data={categories}
        renderItem={({ item }) => (
          <ServiceItem
            imageUrl={item?.image_url}
            name={item?.name}
            categoryId={item?.id}
            categoryName={item?.name}
          />
        )}
      />
    </Box>
  );
};
export default Services;
