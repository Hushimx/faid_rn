import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@ui-kitten/components';
import { Box, useAppTheme } from 'common';
import { BaseModal, ModalHeader } from 'components';
import {
  AppFilterBtn,
  AppPresseble,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
} from 'components/atoms';
import { useDebounce } from 'hooks';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UtilitiesApis } from 'services';
import { ICityResponse, QUERIES_KEY_ENUM } from 'types';

interface IProps {
  onSelectCity: (city: ICityResponse | null) => void;
  selectedCity: ICityResponse | null;
}

const CitiesModal = (props: IProps, ref: any) => {
  const { onSelectCity, selectedCity } = props;
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QUERIES_KEY_ENUM.cities, debouncedSearch],
    queryFn: () => UtilitiesApis.getCities(debouncedSearch),
  });

  const cities: ICityResponse[] = data?.data?.data || [];

  const closeModal = () => {
    ref?.current?.closeModal();
  };

  const handleSelectCity = (city: ICityResponse | null) => {
    onSelectCity(city);
    closeModal();
  };

  const onOpenModal = () => {
    ref?.current?.openModal();
  };

  return (
    <BaseModal ref={ref}>
      <BaseModal.KeyboardRestoreHandler modalRef={ref}>
        <AppSpaceWrapper>
          <ModalHeader
            title={t('selectCity')}
            onReset={() => handleSelectCity(null)}
          />
          <AppSpacer />
          <BaseModal.Input
            placeholder={t('searchCities')}
            value={search}
            onChangeText={setSearch}
            isSearch
          />
          <AppSpacer />
          {isFetching && (
            <Box alignItems="center" paddingVertical="s">
              <Spinner size="small" status="primary" />
            </Box>
          )}

          <BaseModal.AppListContainer>
            {isLoading ? (
              <Box
                flex={1}
                alignItems="center"
                justifyContent="center"
                paddingVertical="xl"
              >
                <Spinner size="large" status="primary" />
              </Box>
            ) : (
              <BaseModal.FlatList
                data={cities}
                keyExtractor={(item: ICityResponse) => item.id.toString()}
                // contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }: { item: ICityResponse }) => {
                  const isSelected = item?.id === selectedCity?.id;
                  return (
                    <AppPresseble onPress={() => handleSelectCity(item)}>
                      <Box
                        width={'100%'}
                        alignSelf="center"
                        borderRadius={12}
                        borderWidth={1}
                        borderColor="grayLight"
                        padding="sm"
                        backgroundColor={isSelected ? 'customGray1' : 'white'}
                        marginBottom="s"
                      >
                        <AppText variant="s1">{item.name}</AppText>
                      </Box>
                    </AppPresseble>
                  );
                }}
              />
            )}
          </BaseModal.AppListContainer>
        </AppSpaceWrapper>
      </BaseModal.KeyboardRestoreHandler>
    </BaseModal>
  );
};

export default forwardRef(CitiesModal);
