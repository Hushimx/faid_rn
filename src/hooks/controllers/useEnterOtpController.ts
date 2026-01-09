import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthApis } from 'services';
import { useAuthStore } from 'store';
import {
  ISendOtpPayload,
  IUser,
  IVerifyOtpPayload,
  IVerifyOtpResponse,
  OTP_TYPE_ENUM,
  QUERIES_KEY_ENUM,
} from 'types';
import { dataExtractor, phoneNumberShapeCreator, translateErrorMessage } from 'utils';

const useEnterOtpController = ({
  phone,
  callingCode,
  isForResetPassword,
  userData,
  isForRegister,
}: {
  phone: string;
  callingCode: string;
  isForResetPassword?: boolean;
  isForRegister?: boolean;
  userData?: {
    user: IUser;
    token: string;
  };
}) => {
  const [countdown, setCountdown] = useState(60);
  const [isValid, setIsValid] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState('');

  const { setIsLoggedIn, setUser, setAccessToken } = useAuthStore();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const {
    data,
    isPending: isLoadingForQuery,
    isRefetching,
    refetch,
    isError: isSendOtpError,
    error: sendOtpError,
  } = useQuery<any, any, { data: ISendOtpPayload }>({
    queryFn: async () => {
      const formattedPhone = phoneNumberShapeCreator({ phone, callingCode });
      return AuthApis.sendOtp({
        phone: formattedPhone,
      });
    },
    queryKey: [QUERIES_KEY_ENUM.send_otp, phone, callingCode],
    retry: false,
    // Always enable the query - it will send OTP when screen loads
    // This works for both new registrations and password resets
    enabled: !!phone && !!callingCode,
    refetchOnMount: true,
  });

  const { mutateAsync: verifyOtp, isPending: isLoading } = useMutation({
    mutationFn: (data: IVerifyOtpPayload) => AuthApis.verifyOtp(data),
    onError: (error: any) => {
      // Error is handled by axios interceptor, but we can add additional handling here if needed
      const errorMessage = error?.response?.data?.message || error?.message || '';
      if (errorMessage) {
        // The axios interceptor will show the translated error via ShowSnackBar
      }
    },
  });

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const onConfirmPress = async (passedOtp: string) => {
    if (isVerifying) return;
    setIsVerifying(true);
    try {
      const res = await verifyOtp({
        phone: phoneNumberShapeCreator({ phone, callingCode }),
        otp: passedOtp,
        type: isForResetPassword
          ? OTP_TYPE_ENUM.password_reset
          : OTP_TYPE_ENUM.verification,
      });
      const otpRes: IVerifyOtpResponse = dataExtractor(res);

      if (isForResetPassword) {
        navigation.navigate('ResetPassword', {
          phone,
          callingCode,
          otp: otpRes?.otp as string,
        });
        return;
      }

      // Handle registration verification - user and token come from verifyOtp response
      if (otpRes?.token && otpRes?.user) {
        setIsLoggedIn(true);
        setAccessToken(otpRes.token);
        setUser(otpRes.user);
      } else if (userData) {
        // Fallback for existing users
        setIsLoggedIn(true);
        setAccessToken(userData?.token);
        setUser(userData?.user);
      }
    } catch (e: any) {
      // Error is handled by the mutation's onError callback or axios interceptor
      // We can add additional error handling here if needed
    } finally {
      setIsVerifying(false);
    }
  };

  // Check if error is 429 (Too Many Requests)
  const isRateLimitError = sendOtpError?.response?.status === 429;
  const rawErrorMessage = sendOtpError?.response?.data?.message || sendOtpError?.message || '';
  const errorMessage = translateErrorMessage(rawErrorMessage || (isRateLimitError ? t('errors.tooManyRequests') : t('errors.failedToSendOtp')));

  return {
    countdown,
    verifyOtp,
    refetch,
    setCountdown,
    onConfirmPress,
    isValid,
    setIsValid,
    isVerifying,
    isLoading: isLoading || isLoadingForQuery || isRefetching,
    otp,
    setOtp,
    isError: isSendOtpError,
    errorMessage,
    isRateLimitError,
  };
};
export default useEnterOtpController;
