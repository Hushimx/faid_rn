import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../types/atoms';

const TicketIcon = ({ 
  size = 25, 
  color = '#2344CD', 
  active = false 
}: IconProps) => {
  const inactiveColor = '#262626';
  const activeColor = color;
  const currentColor = active ? activeColor : inactiveColor;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z"
        stroke={currentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 8H22M2 12H22M2 16H22"
        stroke={currentColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
      <Path
        d="M8 4V20M14 4V20"
        stroke={currentColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <Path
        d="M6 6H8M6 10H8M6 14H8"
        stroke={currentColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default TicketIcon;

