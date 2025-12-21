import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const AppKeyboardAwareScrollView = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <KeyboardAwareScrollView
      bottomOffset={20}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

export default AppKeyboardAwareScrollView;
