import { Box } from '@common';
import {
  AppButton,
  AppInput,
  AppKeyboardAwareScrollView,
  AppSpacer,
  AppText,
  Lock,
  Mail,
} from '@components';
import { useLoginController } from '@hooks';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from 'store';
import { AuthFooter, AuthHeader } from './components';

const Login = () => {
  const { formik, isLoading, onCreateAccountPress, onForgetPasswordPress } =
    useLoginController();
  const { t } = useTranslation();
  const { values, touched, errors, handleSubmit, handleChange } = formik;
  const { loginAsGuest } = useAuthStore();

  const handleGuestLogin = () => {
    loginAsGuest();
  };

  return (
    <Box flex={1} backgroundColor="white">
      <Box width={'95%'} alignSelf="center">
        <AppKeyboardAwareScrollView>
          <AuthHeader
            label={t('loginToyourAccount')}
            subLabel={t('letsRegisterYourAccount')}
          />

          <AppSpacer variant="s" />
          <AppInput
            value={values.email}
            placeholder={t('enterEmail')}
            label={t('email')}
            touched={touched.email}
            caption={errors?.email}
            onChangeText={handleChange('email')}
            keyboardType="email-address"
            accessoryLeft={() => <Mail />}
          />
          <AppSpacer variant="sm" />

          <AppInput
            secureTextEntry
            placeholder={t('enterPassword')}
            label={t('password')}
            value={values.password}
            touched={touched.password}
            caption={errors?.password}
            onChangeText={handleChange('password')}
            isPassword
            accessoryLeft={() => <Lock />}
          />
          <AppSpacer variant="s" />

          <AppText
            textDecorationLine="underline"
            color="red"
            textDecorationColor="red"
            onPress={onForgetPasswordPress}
          >
            {t('forgetPassword')}
          </AppText>
          <AppSpacer variant="xl" />
          <Box width="100%" paddingHorizontal="m">
            <AppButton
              label={t('login')}
              onPress={handleSubmit}
              isLoading={isLoading}
              isFullWidth
            />
          </Box>
          <AppSpacer variant="s" />
          <Box alignItems="center" justifyContent="center" width="100%">
            <AppText variant="s2">
              {t('donothaveAccount')}{' '}
              <AppText onPress={onCreateAccountPress} color="primary">
                {t('createAccount')}
              </AppText>
            </AppText>
          </Box>
          <AppSpacer variant="xxl" />
        </AppKeyboardAwareScrollView>
      </Box>
      <Box
        position="absolute"
        bottom={0}
        width={'100%'}
        alignItems="center"
        justifyContent="center"
        paddingBottom="l"
      >
        <Box width="95%" paddingHorizontal="m">
          <AppButton
            label={t('continueAsGuest')}
            onPress={handleGuestLogin}
            isFullWidth
            isOutLined
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
