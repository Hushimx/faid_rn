import { CommonActions, useNavigation } from '@react-navigation/native';
import { Box } from 'common';
import { AppHeader, AppInput, AppSpaceWrapper, AppSpacer } from 'components';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { phoneNumberShapeCreator, resetPasswordScheme, ShowSnackBar } from 'utils';
import { AuthFooter, AuthHeader } from './components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IResetPasswordPayload, RootStackParamList } from 'types';
import { useMutation } from '@tanstack/react-query';
import { AuthApis } from 'services';
import { useEffect } from 'react';

const ResetPassword = (
  props: NativeStackScreenProps<RootStackParamList, 'ResetPassword'>,
) => {
  const { t } = useTranslation();
  const { phone, callingCode, otp } = props?.route?.params || {};
  const navigation = useNavigation();
  const { values, touched, errors, handleSubmit, handleChange } = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: resetPasswordScheme(t),
    onSubmit: () => updatePassword(),
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IResetPasswordPayload) => AuthApis.resetPassword(data),
  });

  // Validate required params on mount
  useEffect(() => {
    if (!phone || !callingCode || !otp) {
      ShowSnackBar({
        text: t('missingRequiredInformation'),
        type: 'error',
      });
      // Navigate back if possible, otherwise navigate to Login
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' as never }],
          } as any),
        );
      }
    }
  }, [phone, callingCode, otp, navigation, t]);

  const updatePassword = async () => {
    // Validate params before submitting
    if (!phone || !callingCode || !otp) {
      ShowSnackBar({
        text: t('missingRequiredInformation'),
        type: 'error',
      });
      return;
    }

    try {
      await mutateAsync({
        password: values?.password,
        password_confirmation: values.confirmPassword,
        phone: phoneNumberShapeCreator({ phone, callingCode }),
        otp,
      });
      ShowSnackBar({
        text: t('passwordResetSuccessfully'),
        type: 'default',
      });
      navigateToLogin();
    } catch (error: any) {
      // Error is already handled by axios interceptor, but we can add additional handling if needed
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        t('passwordResetFailed');
      // The interceptor already shows the error, but we ensure it's shown here too
      if (!error?.response) {
        ShowSnackBar({
          text: errorMessage,
          type: 'error',
        });
      }
    }
  };

  const navigateToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      } as any),
    );
  };
  return (
    <Box flex={1} backgroundColor="white">
      <AppHeader label={t('resetPassword')} />
      <ScrollView>
        <AppSpaceWrapper>
          <AuthHeader
            label={t('resetPassword')}
            subLabel={t('updatePassword')}
          />

          <AppInput
            value={values.password}
            placeholder={t('enterPassword')}
            label={t('password')}
            touched={touched.password}
            caption={errors.password}
            onChangeText={handleChange('password')}
            isPassword
          />
          <AppSpacer variant="s" />

          <AppInput
            value={values.confirmPassword}
            placeholder={t('enterConfirmPassword')}
            label={t('confirmPassword')}
            touched={touched.confirmPassword}
            caption={errors.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            isPassword
          />
        </AppSpaceWrapper>
      </ScrollView>
      <AuthFooter
        onPress={handleSubmit}
        btnLabel={t('resetYourPassword')}
        firstSubLabel={t('alreadyHaveAccount')}
        secondSubLabel={t('login2')}
        isLoading={isPending}
        onSecondTitlePress={navigateToLogin}
      />
    </Box>
  );
};

export default ResetPassword;
