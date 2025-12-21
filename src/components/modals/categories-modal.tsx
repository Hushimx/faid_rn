import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@ui-kitten/components';
import { Box } from 'common';
import { BaseModal, ModalHeader } from 'components';
import {
  AppFilterBtn,
  AppPresseble,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
} from 'components/atoms';
import { useDebounce } from 'hooks';
import { forwardRef, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HomeApis } from 'services';
import { ICategory, QUERIES_KEY_ENUM } from 'types';

interface IProps {
  onSelectCategory: (category: ICategory | null) => void;
  selectedCategory: ICategory | null;
}

const CategoriesModal = (props: IProps, ref: any) => {
  const { onSelectCategory, selectedCategory } = props;
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QUERIES_KEY_ENUM.categories, debouncedSearch],
    queryFn: () => HomeApis.getCategories({ search: debouncedSearch }),
  });

  const categories: ICategory[] = data?.data?.data || [];

  const closeModal = () => {
    ref?.current?.closeModal();
  };

  const handleSelectCategory = (category: ICategory | null) => {
    onSelectCategory(category);
    closeModal();
  };
  const onOpenModal = () => {
    ref?.current?.openModal();
  };

  return (
    <Fragment>
      <AppFilterBtn
        label={selectedCategory?.name || t('selectCategory')}
        onPress={onOpenModal!}
        isActive={!!selectedCategory}
        marginLeft
      />
      <BaseModal ref={ref}>
        <BaseModal.KeyboardRestoreHandler modalRef={ref}>
          <AppSpaceWrapper>
            <ModalHeader
              title={t('selectCategory')}
              onReset={() => handleSelectCategory(null)}
            />
            <AppSpacer />
            <BaseModal.Input
              placeholder={t('searchCategories')}
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
                  data={categories}
                  keyExtractor={(item: ICategory) => item.id.toString()}
                  renderItem={({ item }: { item: ICategory }) => {
                    const isSelected = item?.id === selectedCategory?.id;
                    return (
                      <AppPresseble onPress={() => handleSelectCategory(item)}>
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
            <AppSpacer variant="ml" />
          </AppSpaceWrapper>
        </BaseModal.KeyboardRestoreHandler>
      </BaseModal>
    </Fragment>
  );
};

export default forwardRef(CategoriesModal);
