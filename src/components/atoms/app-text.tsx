import React from 'react';
import { Colors, FONT_FAMILY, Text, useAppTheme, Theme } from 'common';

type CommonTextProps = React.ComponentProps<typeof Text>;

interface IProps extends CommonTextProps {
  /** theme color key e.g. 'primary' | 'lightBlack' */
  color?: keyof Colors;
  /** convenience alias matching existing usage in codebase */
  variant?: keyof Theme['textVariants'];
}

const AppText = (props: IProps) => {
  const { color, style, children, variant, ...rest } = props;
  const { colors } = useAppTheme();
  const resolvedColor = color ? (colors as any)[color] : undefined;

  return (
    <Text
      variant={variant}
      style={[
        {
          fontFamily: FONT_FAMILY,
          color: resolvedColor ?? colors.cutomBlack,
          textAlign: 'left',
          // I18nManager.isRTL ? 'right' : 'left'
        },
        style,
      ]}
      {...(rest as CommonTextProps)}
    >
      {children}
    </Text>
  );
};

export default AppText;
