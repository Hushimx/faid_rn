import React from 'react';
import Svg, { Path, Mask, G } from 'react-native-svg';
import { ViewStyle } from 'react-native';
import { AppPresseble } from 'components/atoms';

type Props = {
  size?: number;
  color?: string; // color controls the red background
  style?: ViewStyle;
  onPress?: () => void;
};

const CloseCircle: React.FC<Props> = ({
  size = 12,
  color = '#CE1225',
  style,
  onPress,
}) => {
  return (
    <AppPresseble onPress={onPress} disabled={!onPress}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        fill="none"
        style={style}
      >
        <Mask
          id="mask0"
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={12}
          height={12}
        >
          <Path
            d="M5.95817 11.3751C8.94979 11.3751 11.3748 8.95004 11.3748 5.95841C11.3748 2.96679 8.94979 0.541748 5.95817 0.541748C2.96655 0.541748 0.541504 2.96679 0.541504 5.95841C0.541504 8.95004 2.96655 11.3751 5.95817 11.3751Z"
            fill="white"
            stroke="white"
            strokeWidth={1.08333}
            strokeLinejoin="round"
          />
          <Path
            d="M7.49048 4.42627L4.42627 7.49048M4.42627 4.42627L7.49048 7.49048"
            stroke="black"
            strokeWidth={1.08333}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Mask>

        <G mask="url(#mask0)">
          <Path
            d="M-0.541992 -0.541504H12.458V12.4585H-0.541992V-0.541504Z"
            fill={color}
          />
        </G>
      </Svg>
    </AppPresseble>
  );
};

export default CloseCircle;
