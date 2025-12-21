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
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const { colors } = useAppTheme();

    return (
      <Box>
        <AppText children={t('phone')} color="grayDark" variant="s1" />
        <PhoneInput
          ref={ref}
          defaultValue={value}
          defaultCode={countryCode}
          onChangeCountry={onChangeCountry}
          placeholder={t('enterPhoneNumber')}
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
