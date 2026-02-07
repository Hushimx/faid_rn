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
import { LoadingErrorScreenHandler } from 'hoc';
import { useEnterOtpController } from 'hooks';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { RootStackParamList } from 'types';
import { AuthHeader } from './components';

const EnterOtp = (
  props: NativeStackScreenProps<RootStackParamList, 'EnterOtp'>,
) => {
  const { t } = useTranslation();
  const { email, userData, isForResetPassword, isForRegister } =
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
    isError,
    errorMessage,
  } = useEnterOtpController({
    email: email ?? '',
    isForResetPassword,
    isForRegister,
    userData,
  });

  const onResendCodePress = () => {
    refetch();
    setCountdown(OTP_COUNT_DOWN_NUMBER);
  };

  return (
    <Box flex={1} backgroundColor="white">
      <AppHeader label={t('otp')} />
      <LoadingErrorScreenHandler
        loading={isLoading && !isError}
        isError={isError}
        errorMessage={errorMessage}
        refetch={refetch}
      >
        <ScrollView>
          <AppSpaceWrapper>
            <AuthHeader
              label={t('checkYourEmailForOtp')}
              subLabel={t('enterOtpFromYourEmail')}
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
              {countdown > 0 ? (
                <AppText color="grayDark" variant="s1">
                  {t('otpEndsAfter')}{' '}
                <AppText color="grayDark" variant="s1" fontWeight={'bold'}>
                {countdown?.toString().padStart(2, '0')}
                {" "}
                </AppText>
                {t('seconds')}

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
      </LoadingErrorScreenHandler>
      {isLoading && !isError && <LoadingTransparent />}
    </Box>
  );
};

export default EnterOtp;
