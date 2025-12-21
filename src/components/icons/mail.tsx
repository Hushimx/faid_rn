import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
  style?: object;
};

const Mail: React.FC<Props> = ({ size = 24, color = '#464F67', style }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <Path
        d="M17.182 3.5H6.68201C4.47287 3.5 2.68201 5.29086 2.68201 7.5V16.5C2.68201 18.7091 4.47287 20.5 6.68201 20.5H17.182C19.3911 20.5 21.182 18.7091 21.182 16.5V7.5C21.182 5.29086 19.3911 3.5 17.182 3.5Z"
        stroke={color}
        strokeOpacity={0.6}
        strokeWidth={1}
        fill="none"
      />
      <Path
        d="M2.729 7.59L9.934 11.72C10.5378 12.0704 11.2234 12.2549 11.9215 12.2549C12.6196 12.2549 13.3052 12.0704 13.909 11.72L21.134 7.59"
        stroke={color}
        strokeOpacity={0.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        fill="none"
      />
    </Svg>
  );
};

export default Mail;
