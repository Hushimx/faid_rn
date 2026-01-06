import { PhoneInputRefType } from '@linhnguyen96114/react-native-phone-input';
import { Box, useAppTheme } from 'common';
import {
  AppInput,
  AppKeyboardAwareScrollView,
  AppPhoneInput,
  AppSpacer,
  AppSpaceWrapper,
  Lock,
  Mail,
  User,
} from 'components';
import { useSignupController } from 'hooks';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthFooter, AuthHeader } from './components';
const SignUp = () => {
  const { t } = useTranslation();
  const phoneInputRef = useRef<PhoneInputRefType>(null);
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    isLoading,
    goBack,
    setFieldValue,
  } = useSignupController({ phoneRef: phoneInputRef });
  return (
    <Box flex={1} backgroundColor="white">
      <AppKeyboardAwareScrollView>
        <AppSpaceWrapper>
          <AuthHeader
            label={t('registerNowToCreateAccount')}
            subLabel={t('letsRegisterYourNewAccount')}
          />

          <Box flexDirection="row" alignItems="center">
            <Box flex={1}>
              <AppInput
                value={values.firstName}
                placeholder={t('enterFirstName')}
                label={t('firstName')}
                touched={touched.firstName}
                caption={errors?.firstName}
                onChangeText={handleChange('firstName')}
                accessoryLeft={() => <User />}
              />
            </Box>
            <Box flex={0.1} />
            <Box flex={1}>
              <AppInput
                value={values.lastName}
                placeholder={t('enterLastName')}
                label={t('lastName')}
                touched={touched.lastName}
                caption={errors?.lastName}
                onChangeText={handleChange('lastName')}
                accessoryLeft={() => <User />}
              />
            </Box>
          </Box>
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
          <AppSpacer variant="s" />

          <AppPhoneInput
            value={values.phone}
            onChangeText={handleChange('phone')}
            ref={phoneInputRef}
            isTouched={touched.phone}
            error={errors.phone}
            countryCode={values?.countryCode}
            onChangeCountry={code => setFieldValue('countryCode', code)}
            disableCountryPicker={true}
          />
          <AppSpacer variant="s" />

          <AppInput
            value={values.password}
            placeholder={t('enterPassword')}
            label={t('password')}
            touched={touched.password}
            caption={errors?.password}
            onChangeText={handleChange('password')}
            accessoryLeft={() => <Lock />}
            isPassword
          />
          <AppSpacer variant="s" />

          <AppInput
            value={values.confirmPassword}
            placeholder={t('enterConfirmPassword')}
            label={t('confirmPassword')}
            touched={touched.confirmPassword}
            caption={errors?.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            accessoryLeft={() => <Lock />}
            isPassword
          />
          <AppSpacer variant="xxl" />
          <AppSpacer variant="xxl" />
        </AppSpaceWrapper>
      </AppKeyboardAwareScrollView>
      <AuthFooter
        btnLabel={t('signUp')}
        onPress={handleSubmit}
        isLoading={isLoading}
        firstSubLabel={t('alreadyHaveAccount')}
        secondSubLabel={t('login2')}
        onSecondTitlePress={goBack}
      />
    </Box>
  );
};

export default SignUp;
