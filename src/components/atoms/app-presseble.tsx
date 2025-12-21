import { Spinner } from '@ui-kitten/components';
import { Box } from 'common';
import { FC } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface IProps extends PressableProps {
  children: any;
  isLoading?: boolean;
}

const AppPresseble: FC<IProps> = ({ children, style, ...props }) => {
  return (
    <Pressable
      {...props}
      style={state => {
        let baseStyle: StyleProp<ViewStyle>;
        if (typeof style === 'function') {
          baseStyle = style(state);
        } else {
          baseStyle = style;
        }
        return [baseStyle, state.pressed && styles.pressed];
      }}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
    >
      {props?.isLoading ? (
        <Box width={'100%'} alignItems="center" justifyContent="center">
          <Spinner status="primary" />
        </Box>
      ) : (
        children
      )}
    </Pressable>
  );
};

export default AppPresseble;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
});
