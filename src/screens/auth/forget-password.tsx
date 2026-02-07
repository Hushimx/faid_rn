import { useNavigation } from '@react-navigation/native';
import { Box } from 'common';
import { AppErrorMessage, AppInput, AppSpaceWrapper } from 'components';
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
    setValue,
    value,
    isValid,
    setIsValid,
    validateEmail,
  } = useForgetPasswordController({ isForVerification });

  const handleEmailChange = (text: string) => {
    setValue(text);
    setIsValid(validateEmail(text));
  };

  return (
    <Box flex={1} backgroundColor="white">
      <ScrollView>
        <AppSpaceWrapper>
          <AuthHeader
            label={
              isForVerification ? t('emailVerification') : t('forgetPassword')
            }
            subLabel={
              isForVerification
                ? t('checkEmailForVerification')
                : t('pleaseEnterYourEmail')
            }
          />

          <AppInput
            value={value}
            onChangeText={handleEmailChange}
            placeholder={t('email')}
            label={t('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <AppErrorMessage
            isError={!isValid && !!value?.length}
            text={t('errors.enterValidEmail')}
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
