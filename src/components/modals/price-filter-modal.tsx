import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Slider } from '@miblanchard/react-native-slider';
import { Box, useAppTheme } from 'common';
import { BaseModal, ModalHeader } from 'components';
import {
  AppButton,
  AppFilterBtn,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
} from 'components/atoms';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  onApply: (min: number, max: number) => void;
  rangeMin?: number;
  rangeMax?: number;
  currentPriceRange?: { min: number; max: number } | null;
}

const PriceFilterModal = (props: IProps, ref: any) => {
  const { onApply, rangeMin = 0, rangeMax = 10000, currentPriceRange } = props;
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  const [sliderValue, setSliderValue] = useState<number[]>([
    currentPriceRange?.min || rangeMin,
    currentPriceRange?.max || rangeMax,
  ]);

  const [minInput, setMinInput] = useState(
    (currentPriceRange?.min || rangeMin).toString(),
  );
  const [maxInput, setMaxInput] = useState(
    (currentPriceRange?.max || rangeMax).toString(),
  );

  // Sync state when currentPriceRange changes or modal opens
  useEffect(() => {
    if (currentPriceRange) {
      setSliderValue([currentPriceRange.min, currentPriceRange.max]);
      setMinInput(currentPriceRange.min.toString());
      setMaxInput(currentPriceRange.max.toString());
    } else {
      setSliderValue([rangeMin, rangeMax]);
      setMinInput(rangeMin.toString());
      setMaxInput(rangeMax.toString());
    }
  }, [currentPriceRange, rangeMin, rangeMax]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    setMinInput(Math.floor(value[0]).toString());
    setMaxInput(Math.floor(value[1]).toString());
  };

  const handleMinInputChange = (text: string) => {
    setMinInput(text);
    const val = parseFloat(text);
    if (!isNaN(val)) {
      setSliderValue([val, sliderValue[1]]);
    }
  };

  const handleMaxInputChange = (text: string) => {
    setMaxInput(text);
    const val = parseFloat(text);
    if (!isNaN(val)) {
      setSliderValue([sliderValue[0], val]);
    }
  };

  const handleApply = () => {
    const min = parseFloat(minInput);
    const max = parseFloat(maxInput);
    if (!isNaN(min) && !isNaN(max)) {
      onApply(min, max);
      ref?.current?.closeModal();
    }
  };

  const handleReset = () => {
    setSliderValue([rangeMin, rangeMax]);
    setMinInput(rangeMin.toString());
    setMaxInput(rangeMax.toString());
    onApply(0, 0); // Pass 0, 0 to clear the filter
    ref?.current?.closeModal();
  };

  const onOpenModal = () => {
    ref?.current?.openModal();
  };

  return (
    <>
      <BaseModal
        ref={ref}
        activeOffsetY={[-1, 1]}
        failOffsetX={[-5, 5]}
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustPan"
        keyboardBlurBehavior="restore"
      >
        <BottomSheetScrollView>
          <AppSpaceWrapper>
            <ModalHeader
              title={t('filterByPriceRange')}
              onReset={handleReset}
            />
            <AppSpacer variant="m" />

            <Box paddingHorizontal="s">
              <Slider
                value={sliderValue}
                onValueChange={handleSliderChange}
                minimumValue={rangeMin}
                maximumValue={rangeMax}
                step={1}
                thumbTintColor={colors.primary}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.grayLight}
              />
            </Box>

            <AppSpacer variant="m" />

            <Box flexDirection="row" justifyContent="space-between">
              <Box flex={1}>
                <AppText variant="s2" color="grayDark">
                  {t('minPrice')}
                </AppText>
                <AppSpacer variant="s" />
                <BaseModal.Input
                  value={minInput}
                  onChangeText={handleMinInputChange}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </Box>
              <Box width={16} />
              <Box flex={1}>
                <AppText variant="s2" color="grayDark">
                  {t('maxPrice')}
                </AppText>
                <AppSpacer variant="s" />
                <BaseModal.Input
                  value={maxInput}
                  onChangeText={handleMaxInputChange}
                  keyboardType="numeric"
                  placeholder="10000"
                />
              </Box>
            </Box>

            <AppSpacer variant="l" />
            <AppButton label={t('apply')} onPress={handleApply} isFullWidth />
          </AppSpaceWrapper>
          <AppSpacer variant="ml" />
        </BottomSheetScrollView>
      </BaseModal>

      <AppFilterBtn
        label={t('filterByPriceRange')}
        onPress={onOpenModal}
        isActive={!!currentPriceRange}
        marginLeft
      />
    </>
  );
};

export default forwardRef(PriceFilterModal);
