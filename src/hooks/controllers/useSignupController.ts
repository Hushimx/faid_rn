import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import { useState } from 'react';
import { AuthApis } from 'services';
import { useAuthStore } from 'store';
import {
  fcmTokenGenerator,
  phoneNumberShapeCreator,
  signUpScheme,
} from 'utils';
import { PhoneInputRefType } from '@linhnguyen96114/react-native-phone-input';
import { useTranslation } from 'react-i18next';

interface UseSignupControllerProps {
  phoneRef?: React.RefObject<PhoneInputRefType | null>;
}

const useSignupController = ({ phoneRef }: UseSignupControllerProps = {}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setIsLoggedIn } = useAuthStore();
  // const {}=useMutation({
  //   mutationFn:async()=>
  // })
  const {
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    setFieldError,
    setFieldValue,
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: 'SA',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpScheme(t),
    validateOnChange: true,
    onSubmit: () => onSignUpPress(),
  });

  async function onSignUpPress() {
    const { countryCode, phone } = values;
    const callingCode = phoneRef?.current?.getCallingCode();
    const isPhoneValid = phoneRef?.current?.isValidNumber(
      callingCode + values.phone,
    );
    if (!isPhoneValid) {
      setFieldError('phone', t('errors.enterValidPhone'));
      return;
    }
    try {
      setIsLoading(true);
      const fcmToken = await fcmTokenGenerator();
      await AuthApis.signup({
        email: values.email,
        phone: phoneNumberShapeCreator({
          phone: values.phone,
          callingCode,
        }),
        first_name: values.firstName,
        last_name: values.lastName,
        password: values.password,
        password_confirmation: values.confirmPassword,
        fcm_token: fcmToken,
      });

      // Navigate to OTP screen - user will be created after OTP verification
      navigation.navigate('EnterOtp', {
        phone,
        callingCode: callingCode,
        isForRegister: true,
      });
    } catch (e) {
      // Error handling is done by axios interceptor
    } finally {
      setIsLoading(false);
    }
  }
  const goBack = () => navigation.goBack();

  return {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    isLoading,
    goBack,
    onSignUpPress,
    setFieldValue,
  };
};

export default useSignupController;
