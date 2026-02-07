import { Box, useAppTheme } from 'common';
import {
  AppButton,
  AppInput,
  AppShadowContainer,
  AppSpacer,
  AppText,
  AppTextArea,
  AppSwitch,
} from 'components';
import { AppText as AppTextAtom } from 'components/atoms';
import { Fragment, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';
import { PRICE_TYPE_ENUM } from 'types';
import { AppRadioBtn } from 'components';
import { LocationPin } from 'components/icons';

interface Step3PricingLocationProps {
  values: any;
  errors: any;
  touched: any;
  onCostChange: (value: string) => void;
  onPriceTypeChange: (value: PRICE_TYPE_ENUM) => void;
  onLocationChange: (value: string) => void;
  onLocationArChange: (value: string) => void;
  onLocationEnChange: (value: string) => void;
  onSelectLocation: () => void;
  isLocationLoading: boolean;
}

const RiyalAccessory = ({ text }: { text: string }) => (
  <AppTextAtom>{text}</AppTextAtom>
);

// Helper function to convert Arabic numerals to English
const convertArabicToEnglish = (text: string): string => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let result = text;
  arabicNumbers.forEach((arabic, index) => {
    result = result.replace(new RegExp(arabic, 'g'), englishNumbers[index]);
  });
  return result;
};

// Helper function to convert English numerals to Arabic
const convertEnglishToArabic = (text: string): string => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let result = text;
  englishNumbers.forEach((english, index) => {
    result = result.replace(new RegExp(english, 'g'), arabicNumbers[index]);
  });
  return result;
};

const Step3PricingLocation = ({
  values,
  errors,
  touched,
  onCostChange,
  onPriceTypeChange,
  onLocationChange,
  onLocationArChange,
  onLocationEnChange,
  onSelectLocation,
  isLocationLoading,
}: Step3PricingLocationProps) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [isPriceEnabled, setIsPriceEnabled] = useState(
    values.serviceType === PRICE_TYPE_ENUM.fixed
  );

  // Sync toggle state when serviceType changes externally
  useEffect(() => {
    if (values.serviceType === PRICE_TYPE_ENUM.fixed) {
      setIsPriceEnabled(true);
    } else {
      setIsPriceEnabled(false);
    }
  }, [values.serviceType]);

  // Get display address based on current language
  const currentLang = i18n.language || 'ar';
  const displayAddress = currentLang === 'ar' ? (values.fullLocationAr || values.fullLocation) : (values.fullLocationEn || values.fullLocation);

  const handlePriceToggle = (enabled: boolean) => {
    setIsPriceEnabled(enabled);
    if (enabled) {
      onPriceTypeChange(PRICE_TYPE_ENUM.fixed);
    } else {
      onPriceTypeChange(PRICE_TYPE_ENUM.unspecified);
      onCostChange('');
    }
  };

  const handlePriceChange = (text: string) => {
    // Convert Arabic numbers to English for storage
    const englishText = convertArabicToEnglish(text);
    // Only allow numbers and decimal point
    const cleaned = englishText.replace(/[^0-9.]/g, '');
    onCostChange(cleaned);
  };

  // Display value: convert to Arabic if current language is Arabic
  const displayPrice = currentLang === 'ar' && values.serviceCost
    ? convertEnglishToArabic(values.serviceCost)
    : values.serviceCost;

  return (
    <Box flex={1}>
      {/* Pricing Section */}
      <AppShadowContainer
        backgroundColor="white"
        borderRadius={16}
        style={{ padding: 16 }}
      >
        <AppText variant="h5" fontWeight={'700'} marginBottom="m">
          {t('pricing')}
        </AppText>

        <AppText variant="s2" color="grayDark" marginBottom="l">
          {t('setServicePricing')}
        </AppText>

        {/* Price Input Field with Switch on same line */}
        <Box marginBottom="m">
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            marginBottom="s"
          >
            <AppText variant="s1" color="grayDark">
              {t('serviceCost')}
            </AppText>
            <AppSwitch
              isEnabled={isPriceEnabled}
              toggleSwitch={() => handlePriceToggle(!isPriceEnabled)}
            />
          </Box>
          {isPriceEnabled && (
            <AppInput
              placeholder={t('enterServiceCost')}
              accessoryRight={() => <RiyalAccessory text={t('riyal')} />}
              value={displayPrice}
              onChangeText={handlePriceChange}
              touched={touched.serviceCost}
              caption={errors.serviceCost}
              keyboardType="numeric"
            />
          )}
        </Box>

        {/* Price Type Info */}
        <Box
          padding="s"
          borderRadius={8}
          backgroundColor="grayLight"
          marginTop="s"
        >
          <AppText variant="s3" color="grayDark" textAlign="center">
            {isPriceEnabled
              ? t('fixed')
              : t('unspecified')}
          </AppText>
        </Box>
      </AppShadowContainer>

      <AppSpacer variant="m" />

      {/* Location Section */}
      <AppShadowContainer
        backgroundColor="white"
        borderRadius={16}
        style={{ padding: 16 }}
      >
        <AppText variant="h5" fontWeight={'700'} marginBottom="m">
          {t('location')}
        </AppText>

        <AppText variant="s2" color="grayDark" marginBottom="l">
          {t('setServiceLocation')}
        </AppText>

        <AppTextArea
          label={t('fullLocation')}
          placeholder={t('enterFullLocation')}
          value={currentLang === 'ar' ? (values.fullLocationAr || '') : (values.fullLocationEn || '')}
          editable={false}
          touched={touched.fullLocation || touched.fullLocationAr}
          caption={errors.fullLocationAr || errors.fullLocation}
        />
        <AppSpacer variant="m" />
        <AppButton
          label={t('selectLocationOnMap')}
          isOutLined
          onPress={onSelectLocation}
          isFullWidth
          isLoading={isLocationLoading}
          loadingStatus={'primary'}
          icon={
            <Box marginRight="s">
              <LocationPin size={20} color={colors.primary} />
            </Box>
          }
        />
      </AppShadowContainer>
    </Box>
  );
};

export default Step3PricingLocation;

