import { Radio, RadioProps } from '@ui-kitten/components';
import { FONT_FAMILY, useAppTheme } from 'common';
import { I18nManager, StyleSheet } from 'react-native';
import AppText from './app-text';

interface IProps extends Omit<RadioProps, 'children'> {
  text?: string;
}

const AppRadioBtn = (props: IProps) => {
  const { text, ...radioProps } = props;
  const { colors } = useAppTheme();

  return (
    <Radio {...radioProps} style={[styles.container, props.style]}>
      {text && (
        <AppText
          style={[
            styles.text,
            { textAlign: I18nManager.isRTL ? 'right' : 'left' },
          ]}
        >
          {text}
        </AppText>
      )}
    </Radio>
  );
};

export default AppRadioBtn;

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  text: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    marginLeft: 8,
  },
});
