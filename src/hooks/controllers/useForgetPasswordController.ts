import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const useForgetPasswordController = ({
  isForVerification,
}: {
  isForVerification?: boolean;
}) => {
  const navigation = useNavigation();

  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (email: string) => EMAIL_REGEX.test(email.trim());

  const onConfirmPress = async () => {
    const emailValid = validateEmail(value);
    if (!emailValid) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    try {
      navigation.navigate('EnterOtp', {
        email: value.trim().toLowerCase(),
        isForResetPassword: !isForVerification,
      });
    } catch (e) {}
  };

  return {
    onConfirmPress,
    value,
    setValue,
    isValid,
    setIsValid,
    validateEmail,
  };
};

export default useForgetPasswordController;
