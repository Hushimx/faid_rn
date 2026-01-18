import { PhoneInputRefType } from '@linhnguyen96114/react-native-phone-input';
import { Box } from 'common';
import {
  AppButton,
  AppInput,
  AppKeyboardAwareScrollView,
  AppPhoneInput,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  Lock,
  Mail,
  User,
} from 'components';
import { useSignupController } from 'hooks';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthHeader } from './components';
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
            containerStyle={{
              direction: 'ltr',
            }}
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
          <AppSpacer variant="xl" />
          <Box width="100%" paddingHorizontal="m">
            <AppButton
              label={t('signUp')}
              onPress={handleSubmit}
              isLoading={isLoading}
              isFullWidth
            />
          </Box>
          <AppSpacer variant="s" />
          <Box alignItems="center" justifyContent="center" width="100%">
            <AppText variant="s2">
              {t('alreadyHaveAccount')}{' '}
              <AppText onPress={goBack} color="primary">
                {t('login2')}
              </AppText>
            </AppText>
          </Box>
          <AppSpacer variant="xxl" />
          <AppSpacer variant="xxl" />
        </AppSpaceWrapper>
      </AppKeyboardAwareScrollView>
    </Box>
  );
};

export default SignUp;
