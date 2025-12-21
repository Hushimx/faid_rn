import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { AuthApis } from 'services';
import { useAuthStore } from 'store';
import { ILoginPayload } from 'types';
import { fcmTokenGenerator, loginScheme } from 'utils';

const useAuthController = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { setUser, setIsLoggedIn, setAccessToken } = useAuthStore();

  const { isPending, mutateAsync } = useMutation<any, Error, ILoginPayload>({
    mutationFn: async payload => await AuthApis.login(payload),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginScheme(t),
    validateOnChange: true,
    onSubmit: () => {
      onLoginPress();
    },
  });

  const onLoginPress = async () => {
    try {
      const fcmToken = await fcmTokenGenerator();
      const res = await mutateAsync({
        email: formik.values.email,
        password: formik.values.password,
        fcm_token: fcmToken,
      });
      const resData = res.data?.data;
      const isVerified = resData?.user?.email_verified_at;

      if (isVerified) {
        setAccessToken(resData.token);
        setUser(resData.user);
        setIsLoggedIn(true);
      } else {
        navigation.navigate('ForgetPassword', {
          isForVerification: true,
        });
      }
    } catch (err) {
      console.log('❌ Login failed:', err);
    }
  };

  return {
    formik,
    onLoginPress,
    isLoading: isPending,
    onCreateAccountPress: () => navigation.navigate('SignUp'),
    onForgetPasswordPress: () => navigation.navigate('ForgetPassword'),
  };
};

export default useAuthController;
