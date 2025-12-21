import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
  stroke?: string;
  opacity?: number;
}

const User: React.FC<Props> = ({
  width = 24,
  height = 24,
  stroke = '#464F67',
  opacity = 0.6,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19.5 22.3134C19.025 12.9804 4.975 12.9804 4.5 22.3134M15 9.31335C15 10.109 14.6839 10.8721 14.1213 11.4347C13.5587 11.9973 12.7956 12.3134 12 12.3134C11.2044 12.3134 10.4413 11.9973 9.87868 11.4347C9.31607 10.8721 9 10.109 9 9.31335C9 8.51771 9.31607 7.75464 9.87868 7.19203C10.4413 6.62943 11.2044 6.31335 12 6.31335C12.7956 6.31335 13.5587 6.62943 14.1213 7.19203C14.6839 7.75464 15 8.51771 15 9.31335Z"
        stroke={stroke}
        strokeOpacity={opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default User;
