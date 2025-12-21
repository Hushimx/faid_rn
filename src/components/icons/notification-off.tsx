import React from 'react';
import Svg, { Path } from 'react-native-svg';

const NotificationOffIcon = ({ size = 24, color = '#3E4453' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 22H13"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 4C12.5523 4 13 3.55228 13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44772 11 3C11 3.55228 11.4477 4 12 4Z"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M6 19V10C6 8.85601 6.32 7.786 6.876 6.876M6 19H18M6 19H4M18 19V18M18 19H19M9.999 4.34201C10.9041 4.02181 11.8729 3.9235 12.8239 4.05534C13.7749 4.18718 14.6804 4.54531 15.4643 5.09965C16.2482 5.654 16.8876 6.38836 17.3288 7.24106C17.7701 8.09377 18.0002 9.03991 18 10V12.343"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 4L20 20"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default NotificationOffIcon;
