import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Box, useAppTheme } from 'common';
import {
  AppInput,
  AppPresseble,
  AppSpacer,
  AppText,
  BaseModal,
  Chevron,
} from 'components';
import { useCallback, useRef } from 'react';
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

  const handleSelect = useCallback(
    (itemValue: string) => {
      onSelect(itemValue);
      modalRef.current?.closeModal();
    },
    [onSelect],
  );

  const safeData = data ?? [];
  const selectedItem = safeData.find(item => item.value === value);
  const selectedLabel = selectedItem?.label;

  const keyExtractor = useCallback(
    (item: { label: string; value: any }, index: number) =>
      String(item?.value ?? index),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: { label: string; value: any } }) => {
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
            marginBottom="sm"
          >
            <AppText
              variant="s1"
              color={isSelected ? 'primary' : 'darkSlateBlue'}
            >
              {item.label}
            </AppText>
          </Box>
        </AppPresseble>
      );
    },
    [value, handleSelect],
  );

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

      <BaseModal ref={modalRef} enableContentPanningGesture={false}>
        <Box width={'100%'} alignSelf="center" paddingHorizontal="m">
          <AppText variant="h6">{placeholder}</AppText>
          <AppSpacer variant="s" />
        </Box>
        <BottomSheetFlatList
          data={safeData}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            paddingBottom: spacing.xxl * 2,
            paddingHorizontal: spacing.m,
          }}
          renderItem={renderItem}
          removeClippedSubviews={false}
        />
      </BaseModal>
    </>
  );
};

export default AppDropdown;
