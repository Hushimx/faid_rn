import { useNavigation } from '@react-navigation/native';
import { Box } from 'common';
import { AppErrorMessage, AppPhoneInput, AppSpaceWrapper } from 'components';
import { useForgetPasswordController } from 'hooks';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { AuthFooter, AuthHeader } from './components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'types';

const ForgetPassword = (
  props: NativeStackScreenProps<RootStackParamList, 'ForgetPassword'>,
) => {
  const { t } = useTranslation();
  const { isForVerification } = props?.route?.params || {};
  const navigation = useNavigation();
  const {
    onConfirmPress,
    setCountryCode,
    countryCode,
    setValue,
    value,
    phoneInputRef,
    isValid,
    setIsValid,
  } = useForgetPasswordController({ isForVerification });

  return (
    <Box flex={1} backgroundColor="white">
      <ScrollView>
        <AppSpaceWrapper>
          <AuthHeader
            label={
              isForVerification ? t('phoneVerification') : t('forgetPassword')
            }
            subLabel={
              isForVerification
                ? t('checkPhoneForVerification')
                : t('pleaseEnterYourPhone')
            }
          />

          <AppPhoneInput
            ref={phoneInputRef}
            value={value}
            onChangeText={setValue}
            isValid={isValid}
            setIsValid={setIsValid}
            countryCode={countryCode}
            onChangeCountry={setCountryCode}
          />
          <AppErrorMessage
            isError={!isValid && !!value?.length}
            text={t('errors.enterValidPhone')}
          />
        </AppSpaceWrapper>
      </ScrollView>
      <AuthFooter
        onPress={onConfirmPress}
        btnLabel={t('sendOtp')}
        firstSubLabel={t('alreadyHaveAccount')}
        secondSubLabel={t('login2')}
        disableSecondLabel={isForVerification}
        onSecondTitlePress={() => navigation.goBack()}
      />
    </Box>
  );
};

export default ForgetPassword;
