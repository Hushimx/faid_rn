import { Box, useAppTheme } from 'common';
import {
  AppInput,
  AppPresseble,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  BaseModal,
  Chevron,
} from 'components';
import { useRef } from 'react';
import { I18nManager, TouchableOpacity } from 'react-native';
import { IModalRef } from 'types';

interface IProps {
  data: { label: string; value: any }[];
  label?: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  value?: any;
  error?: string;
  touched?: boolean;
}

const AppDropdown = ({
  data,
  label,
  placeholder,
  onSelect,
  value,
  error,
  touched,
}: IProps) => {
  const modalRef = useRef<IModalRef>(null);
  const { colors, spacing } = useAppTheme();

  const handleSelect = (itemValue: string) => {
    onSelect(itemValue);
    modalRef.current?.closeModal();
  };

  const selectedItem = data?.find(item => item.value === value);
  const selectedLabel = selectedItem?.label;

  return (
    <>
      <TouchableOpacity onPress={() => modalRef.current?.openModal()}>
        <Box pointerEvents="none">
          <AppInput
            label={label}
            placeholder={placeholder}
            value={selectedLabel || ''}
            caption={error}
            touched={touched}
            editable={false}
            accessoryRight={() => (
              <Chevron
                styles={{
                  transform: [
                    { rotate: I18nManager.isRTL ? '270deg' : '90deg' },
                  ],
                }}
                size={20}
                color={colors.grayDark}
              />
            )}
          />
        </Box>
      </TouchableOpacity>

      <BaseModal ref={modalRef}>
        <AppSpaceWrapper>
          <Box width={'100%'} alignSelf="center">
            <AppText variant="h6">{placeholder}</AppText>
          </Box>
          <AppSpacer variant="s" />
          <BaseModal.AppListContainer>
            <BaseModal.FlatList
              data={data}
              keyExtractor={(item: any) => item.value}
              contentContainerStyle={{
                paddingBottom: spacing.xxl * 2,
              }}
              renderItem={({ item }: any) => {
                const isSelected = item.value === value;
                return (
                  <AppPresseble onPress={() => handleSelect(item.value)}>
                    <Box
                      width={'100%'}
                      alignSelf="center"
                      borderRadius={12}
                      borderWidth={1}
                      borderColor={isSelected ? 'primary' : 'grayLight'}
                      padding="sm"
                      backgroundColor={isSelected ? 'customGray1' : 'white'}
                    >
                      <AppText variant="s1" color={isSelected ? 'primary' : 'darkSlateBlue'}>
                        {item.label}
                      </AppText>
                    </Box>
                  </AppPresseble>
                );
              }}
            />
          </BaseModal.AppListContainer>
        </AppSpaceWrapper>
      </BaseModal>
    </>
  );
};

export default AppDropdown;
