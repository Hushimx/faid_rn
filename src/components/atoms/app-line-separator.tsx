import { useAppTheme } from 'common';
import Svg, { Line } from 'react-native-svg';

const AppLineSeparator = () => {
  const { colors } = useAppTheme();
  return (
    <Svg width="100%" height="1">
      <Line
        x1="0"
        y1="0"
        x2="100%"
        y2="0"
        stroke={colors.grayLight}
        strokeWidth="1.5"
        opacity="1"
      />
    </Svg>
  );
};
export default AppLineSeparator;
