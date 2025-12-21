import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

type Props = {
  size?: number;
  color?: string;
  style?: ViewStyle;
};

const RoundedPhone: React.FC<Props> = ({
  size = 24,
  color = '#2445CE',
  style,
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <Path
        d="M19.506 7.96C18.7925 10.7425 17.3445 13.2821 15.3133 15.3133C13.2821 17.3445 10.7425 18.7925 7.96 19.506C5.819 20.051 4 18.21 4 16V15C4 14.448 4.449 14.005 4.998 13.95C5.9084 13.8595 6.80207 13.6445 7.654 13.311L9.174 14.831C11.6489 13.6446 13.6446 11.6489 14.831 9.174L13.311 7.654C13.6448 6.80211 13.8602 5.90844 13.951 4.998C14.005 4.448 14.448 4 15 4H16C18.21 4 20.051 5.819 19.506 7.96Z"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
};

export default RoundedPhone;
