import { Input, InputProps } from '@ui-kitten/components';
import { FONT_FAMILY, useAppTheme } from 'common';
import { useState } from 'react';
import { I18nManager, StyleSheet } from 'react-native';
import AppText from './app-text';
import { Eye } from 'components/icons';
import AppErrorMessage from './app-input-error-msg';

interface IProps extends InputProps {
  touched?: boolean;
  isPassword?: boolean;
}

const AppInput = (props: IProps) => {
  const { touched, caption, label, isPassword } = props;
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);
  const { colors } = useAppTheme();
  const isError = !!touched && !!caption;

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  return (
    <Input
      style={[
        styles.container,
        { borderColor: isError ? colors.red : colors.grayLight },
      ]}
      {...props}
      status={'control'}
      placeholderTextColor={'gray'}
      textStyle={[
        {
          textAlign: I18nManager.isRTL ? 'right' : 'left',
          height: 40,
          fontFamily: FONT_FAMILY,
          color: 'black',
        },
        props?.textStyle,
      ]}
      label={() =>
        label ? (
          <AppText children={label} color="grayDark" variant="s1" />
        ) : undefined
      }
      caption={<AppErrorMessage text={caption} isError={isError} />}
      secureTextEntry={secureTextEntry}
      accessoryRight={
        isPassword
          ? () => (
              <Eye isVisible={!secureTextEntry} onPress={toggleSecureEntry} />
            )
          : props?.accessoryRight
      }
    />
  );
};

export default AppInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 12,
  },
});
