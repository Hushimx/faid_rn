import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import React, { forwardRef } from 'react';
import { Platform, StyleSheet } from 'react-native';

interface AppKeyboardAwareScrollViewProps {
  children: React.ReactNode;
}

const AppKeyboardAwareScrollView = forwardRef<
  any,
  AppKeyboardAwareScrollViewProps
>(({ children }, ref) => {
  return (
    <KeyboardAwareScrollView
      ref={ref}
      bottomOffset={20}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.contentContainer}
    >
      {children}
    </KeyboardAwareScrollView>
  );
});

AppKeyboardAwareScrollView.displayName = 'AppKeyboardAwareScrollView';

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: Platform.OS === 'android' ? 120 : 100,
  },
});

export default AppKeyboardAwareScrollView;
