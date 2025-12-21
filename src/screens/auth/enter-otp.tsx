import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box, OTP_COUNT_DOWN_NUMBER, useAppTheme } from 'common';
import {
  AppErrorMessage,
  AppHeader,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  LoadingTransparent,
} from 'components';
import { useEnterOtpController } from 'hooks';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { RootStackParamList } from 'types';
import { AuthHeader } from './components';

const EnterOtp = (
  props: NativeStackScreenProps<RootStackParamList, 'EnterOtp'>,
) => {
  const { t } = useTranslation();
  const { phone, callingCode, userData, isForResetPassword } =
    props?.route?.params || {};
  const { colors } = useAppTheme();

  const {
    countdown,
    refetch,
    setCountdown,
    onConfirmPress,
    isValid,
    isVerifying,
    isLoading,
    otp,
    setOtp,
  } = useEnterOtpController({
    phone,
    callingCode,
    isForResetPassword,
    userData,
  });

  const onResendCodePress = () => {
    refetch();
    setCountdown(OTP_COUNT_DOWN_NUMBER);
  };

  return (
    <Box flex={1} backgroundColor="white">
      <AppHeader label={t('otp')} />
      <ScrollView>
        <AppSpaceWrapper>
          <AuthHeader
            label={t('checkYourPhoneForOtp')}
            subLabel={t('enterOtpFromYourPhone')}
          />

          <OtpInput
            numberOfDigits={6}
            onTextChange={setOtp}
            onFilled={onConfirmPress}
            disabled={isVerifying}
            theme={{
              focusedPinCodeContainerStyle: {
                borderColor: colors.primary,
              },
            }}
          />

          <AppSpacer variant="sm" />

          {/* Countdown timer below OTP input */}
          <Box
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <AppText color="grayDark" variant="s1">
              {t('otpEndsAfter')}{' '}
              <AppText color="grayDark" variant="s1" fontWeight={'bold'}>
                {OTP_COUNT_DOWN_NUMBER}{' '}
              </AppText>
              {t('seconds')}
            </AppText>
            {countdown > 0 ? (
              <AppText color="grayDark" variant="s1">
                {'00'}:{countdown?.toString().padStart(2, '0')}
              </AppText>
            ) : (
              <AppText
                color="primary"
                textDecorationLine="underline"
                textDecorationColor="primary"
                variant="s1"
                onPress={onResendCodePress}
              >
                {t('resendOtp')}
              </AppText>
            )}
          </Box>

          <AppErrorMessage
            isError={!isValid && !!otp?.length}
            text={t('errors.enterValidOtp')}
          />
        </AppSpaceWrapper>
      </ScrollView>
      {isLoading && <LoadingTransparent />}
    </Box>
  );
};

export default EnterOtp;

const styles = StyleSheet.create({
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'white',
    height: 56,
    width: 56,
    fontSize: 24,
    textAlign: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
});
