import { Box, COLORS, FONT_FAMILY, useAppTheme } from 'common';
import { FC } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
} from 'react-native';
import AppText from './app-text';
import { Spinner } from '@ui-kitten/components';

interface IProps extends PressableProps {
  label: string;
  isMedium?: boolean;
  isLoading?: boolean;
  isOutLined?: boolean;
  textColor?: keyof typeof COLORS;
  icon?: any;
  loadingStatus?: 'primary';
  isFullWidth?: boolean;
}

const AppButton: FC<IProps> = props => {
  const { isLoading, isOutLined, textColor, icon, loadingStatus, disabled } =
    props;
  const { colors } = useAppTheme();
  return (
    <Pressable
      {...props}
      disabled={props?.disabled || isLoading}
      style={[
        styles.container,
        {
          backgroundColor: disabled
            ? colors.grayLight
            : isOutLined
            ? colors.white
            : colors?.primary,
          borderWidth: 1,
          borderColor: disabled ? colors.grayLight : colors.primary,
        },
        props?.style as any,
        props?.isFullWidth && {
          width: '100%',
        },
      ]}
    >
      {isLoading ? (
        <Spinner size="medium" status={loadingStatus ?? 'control'} />
      ) : (
        <Box alignItems="center" flexDirection="row">
          {icon}
          <AppText
            color={textColor ?? (isOutLined ? 'primary' : 'white')}
            variant="s1"
          >
            {props?.label}
          </AppText>
        </Box>
      )}
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 12,
    height: 60,
    fontFamily: FONT_FAMILY,
  },
});
