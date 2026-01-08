import { Box } from 'common';
import { BaseModal, ModalHeader } from 'components';
import {
  AppFilterBtn,
  AppPresseble,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
} from 'components/atoms';
import { forwardRef, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

export type SortOption = 'latest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating';

interface IProps {
  onSelectSort: (sort: SortOption | null) => void;
  selectedSort: SortOption | null;
}

const SortModal = (props: IProps, ref: any) => {
  const { onSelectSort, selectedSort } = props;
  const { t } = useTranslation();

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'latest', label: t('sortLatest') },
    { value: 'oldest', label: t('sortOldest') },
    { value: 'price_asc', label: t('sortPriceLowToHigh') },
    { value: 'price_desc', label: t('sortPriceHighToLow') },
    { value: 'rating', label: t('sortRating') },
  ];

  const closeModal = () => {
    ref?.current?.closeModal();
  };

  const handleSelectSort = (sort: SortOption | null) => {
    onSelectSort(sort);
    closeModal();
  };

  const onOpenModal = () => {
    ref?.current?.openModal();
  };

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === selectedSort);
    return option?.label || t('sortBy');
  };

  return (
    <Fragment>
      <AppFilterBtn
        label={getSortLabel()}
        onPress={onOpenModal}
        isActive={!!selectedSort}
        marginLeft
      />
      <BaseModal ref={ref}>
        <BaseModal.KeyboardRestoreHandler modalRef={ref}>
          <AppSpaceWrapper>
            <ModalHeader
              title={t('sortBy')}
              onReset={() => handleSelectSort(null)}
            />
            <AppSpacer />
            <BaseModal.AppListContainer>
              <BaseModal.FlatList
                data={sortOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => {
                  const isSelected = item.value === selectedSort;
                  return (
                    <AppPresseble
                      onPress={() => handleSelectSort(item.value)}
                    >
                      <Box
                        width={'100%'}
                        alignSelf="center"
                        borderRadius={12}
                        borderWidth={1}
                        borderColor={isSelected ? 'primary' : 'grayLight'}
                        padding="sm"
                        backgroundColor={isSelected ? 'primary' : 'white'}
                        marginBottom="s"
                      >
                        <AppText
                          variant="s1"
                          color={isSelected ? 'white' : 'cutomBlack'}
                        >
                          {item.label}
                        </AppText>
                      </Box>
                    </AppPresseble>
                  );
                }}
              />
            </BaseModal.AppListContainer>
            <AppSpacer variant="ml" />
          </AppSpaceWrapper>
        </BaseModal.KeyboardRestoreHandler>
      </BaseModal>
    </Fragment>
  );
};

export default forwardRef(SortModal);

