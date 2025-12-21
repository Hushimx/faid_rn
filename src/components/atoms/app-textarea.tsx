import { Box, FONT_FAMILY, SPACING, useAppTheme } from 'common';
import { I18nManager, StyleSheet, TextInputProps } from 'react-native';
import Textarea from 'react-native-textarea';
import AppErrorMessage from './app-input-error-msg';
import AppText from './app-text';

interface IProps extends TextInputProps {
  touched?: boolean;
  label?: string;
  caption?: string;
  containerStyle?: any;
}

const AppTextArea = (props: IProps) => {
  const { touched, caption, label, containerStyle } = props;
  const { colors } = useAppTheme();
  const isError = !!touched && !!caption;

  return (
    <Box style={containerStyle}>
      {label && (
        <AppText
          children={label}
          color="grayDark"
          variant="s1"
          marginBottom="s"
        />
      )}
      <Textarea
        containerStyle={[
          styles.textareaContainer,
          { borderColor: isError ? colors.red : colors.grayLight },
        ]}
        style={[
          styles.textarea,
          {
            textAlign: I18nManager.isRTL ? 'right' : 'left',
            fontFamily: FONT_FAMILY,
            color: 'black',
          },
          props.style,
        ]}
        placeholderTextColor={'gray'}
        underlineColorAndroid={'transparent'}
        {...props}
      />
      <AppErrorMessage text={caption!} isError={isError} />
    </Box>
  );
};

export default AppTextArea;

const styles = StyleSheet.create({
  textareaContainer: {
    height: 120,
    padding: 5,
    backgroundColor: '#fafbfd',
    borderRadius: 12,
    borderWidth: 1,
  },
  textarea: {
    textAlignVertical: 'top', // hack android
    height: 110,
    fontSize: SPACING.m,
    color: '#333',
    paddingLeft: SPACING.s,
  },
});
