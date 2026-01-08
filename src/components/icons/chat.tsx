import * as React from 'react';
import Svg, {
  Path,
  Defs,
  Filter,
  FeFlood,
  FeColorMatrix,
  FeMorphology,
  FeOffset,
  FeGaussianBlur,
  FeComposite,
  FeBlend,
  G,
} from 'react-native-svg';
import { IconProps } from '../../types/atoms';

const ChatIcon = ({
  size = 48,
  color = '#2344CD',
  active = false,
}: IconProps) => {
  const inactiveColor = '#262626';
  const activeColor = color;
  const currentColor = active ? activeColor : inactiveColor;

  return (
    <Svg width={size} height={size * 0.792} viewBox="0 0 48 38" fill="none">
      {/* Main chat bubble */}
      <Path
        d="M12 6H28C29.1046 6 30 6.89543 30 8V18C30 19.1046 29.1046 20 28 20H18L12 24V8C12 6.89543 12.8954 6 12 6Z"
        stroke={currentColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Chat bubble tail */}
      <Path
        d="M12 20L8 24V20H6C4.89543 20 4 19.1046 4 18V8C4 6.89543 4.89543 6 6 6H12"
        stroke={currentColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Message lines */}
      <Path
        d="M10 11H22M10 15H18"
        stroke={currentColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Active indicator bar */}
      <G filter={active ? 'url(#filter0_d_chat)' : undefined}>
        <Path
          d="M18 30H30C30 31.1046 29.1046 32 28 32H20C18.8954 32 18 31.1046 18 30Z"
          fill={active ? currentColor : 'none'}
        />
      </G>
      {active && (
        <Defs>
          <Filter
            id="filter0_d_chat"
            x="0"
            y="0"
            width="48"
            height="38"
            filterUnits="userSpaceOnUse"
          >
            <FeFlood floodOpacity="0" result="BackgroundImageFix" />
            <FeColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <FeMorphology
              radius="2"
              operator="dilate"
              in="SourceAlpha"
              result="effect1_dropShadow_chat"
            />
            <FeOffset dy={-12} />
            <FeGaussianBlur stdDeviation="8" />
            <FeComposite in2="hardAlpha" operator="out" />
            <FeColorMatrix
              type="matrix"
              values="0 0 0 0 0.325056 0 0 0 0 0.435891 0 0 0 0 0.896023 0 0 0 1 0"
            />
            <FeBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_chat"
            />
            <FeBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_chat"
              result="shape"
            />
          </Filter>
        </Defs>
      )}
    </Svg>
  );
};

export default ChatIcon;






