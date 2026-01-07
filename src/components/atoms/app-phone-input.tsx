import { forwardRef } from 'react';
import { I18nManager } from 'react-native';
import PhoneInput, {
  PhoneInputProps,
  PhoneInputRefType,
} from '@linhnguyen96114/react-native-phone-input';
import { Box, FONT_FAMILY, useAppTheme } from 'common';
import AppText from './app-text';
import { useTranslation } from 'react-i18next';
import AppErrorMessage from './app-input-error-msg';

interface IAppPhoneInputProps extends Omit<PhoneInputProps, 'onChangeText'> {
  value: string;
  onChangeText: (value: string) => void;
  defaultCode?: string;
  isValid?: boolean;
  setIsValid?: (isValid: boolean) => void;
  error?: string;
  isTouched?: boolean;
  onChangeCountry?: (country: any) => void;
  countryCode: string;
  onlyCountries?: string[];
  disableCountryPicker?: boolean;
}

const AppPhoneInput = forwardRef<PhoneInputRefType, IAppPhoneInputProps>(
  (
    {
      value,
      onChangeText,
      defaultCode = 'SA',
      isValid,
      setIsValid,
      containerStyle,
      textContainerStyle,
      textInputStyle,
      error,
      isTouched,
      onChangeCountry,
      countryCode = 'SA',
      onlyCountries,
      disableCountryPicker = false,
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const { colors } = useAppTheme();

    // Force SA if country picker is disabled
    const finalCountryCode = disableCountryPicker ? 'SA' : countryCode;

    return (
      <Box>
        <AppText children={t('phone')} color="grayDark" variant="s1" />
        <PhoneInput
          ref={ref}
          defaultValue={value}
          defaultCode={finalCountryCode}
          onChangeCountry={disableCountryPicker ? undefined : onChangeCountry}
          placeholder={t('enterPhoneNumber')}
          onlyCountries={onlyCountries}
          disableCountryPicker={disableCountryPicker}
          textInputProps={{
            selectionColor: colors.primaryLight,
          }}
          onChangeText={text => {
            if (setIsValid && !isValid) setIsValid(true);
            onChangeText(text);
          }}
          containerStyle={[
            {
              width: '100%',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.grayLight,
              backgroundColor: 'white',
              height: 55,
              alignItems: 'center',
            },
            containerStyle,
          ]}
          flagButtonStyle={
            disableCountryPicker
              ? {
                  display: 'none',
                  width: 0,
                  opacity: 0,
                }
              : undefined
          }
          textContainerStyle={[
            {
              borderRadius: 12,
              backgroundColor: 'white',
              paddingHorizontal: 15,
            },
            textContainerStyle,
          ]}
          textInputStyle={[
            {
              textAlign: I18nManager.isRTL ? 'right' : 'left',
              fontFamily: FONT_FAMILY,
            },
            textInputStyle,
          ]}
          {...props}
        />
        <AppErrorMessage text={error ?? ''} isError={!!error && isTouched} />
      </Box>
    );
  },
);

AppPhoneInput.displayName = 'AppPhoneInput';

export default AppPhoneInput;
