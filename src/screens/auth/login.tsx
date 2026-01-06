import { Box } from '@common';
import {
  AppInput,
  AppKeyboardAwareScrollView,
  AppSpacer,
  AppText,
  Lock,
  Mail,
} from '@components';
import { useLoginController } from '@hooks';
import { useTranslation } from 'react-i18next';
import { AuthFooter, AuthHeader } from './components';

const Login = () => {
  const { formik, isLoading, onCreateAccountPress, onForgetPasswordPress } =
    useLoginController();
  const { t } = useTranslation();
  const { values, touched, errors, handleSubmit, handleChange } = formik;

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
          <AppSpacer variant="xxl" />
        </AppKeyboardAwareScrollView>
      </Box>
      <AuthFooter
        btnLabel={t('login')}
        onPress={handleSubmit}
        isLoading={isLoading}
        firstSubLabel={t('donothaveAccount')}
        secondSubLabel={t('createAccount')}
        onSecondTitlePress={onCreateAccountPress}
      />
    </Box>
  );
};

export default Login;
