import { PhoneInputRefType } from '@linhnguyen96114/react-native-phone-input';
import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';

const useForgetPasswordController = ({
  isForVerification,
}: {
  isForVerification?: boolean;
}) => {
  const phoneInputRef = useRef<PhoneInputRefType>(null);
  const navigation = useNavigation();

  const [value, setValue] = useState('');
  const [countryCode, setCountryCode] = useState('SA');
  const [isValid, setIsValid] = useState(false);

  const onConfirmPress = async () => {
    const callingCode = phoneInputRef?.current?.getCallingCode();
    const isValidNumber = phoneInputRef?.current?.isValidNumber(
      callingCode + value,
    );
    if (!isValidNumber) {
      setIsValid(false);
      return;
    }
    try {
      navigation.navigate('EnterOtp', {
        phone: value,
        callingCode,
        isForResetPassword: !isForVerification,
      });
    } catch (e) {}
  };
  return {
    onConfirmPress,
    value,
    setValue,
    countryCode,
    setCountryCode,
    phoneInputRef,
    isValid,
    setIsValid,
  };
};

export default useForgetPasswordController;
