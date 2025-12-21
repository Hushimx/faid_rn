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

const HomeIcon = ({
  size = 48,
  color = '#2344CD',
  active = false,
}: IconProps) => {
  const inactiveColor = '#262626';
  const activeColor = color;
  const currentColor = active ? activeColor : inactiveColor;

  return (
    <Svg width={size} height={size * 0.792} viewBox="0 0 48 38" fill="none">
      <Path
        d="M31.6329 9.10999L25.1589 5.08999C24.8047 4.86884 24.3955 4.75159 23.9779 4.75159C23.5604 4.75159 23.1512 4.86884 22.7969 5.08999L16.3239 9.13299C15.9559 9.36509 15.6638 9.69979 15.4836 10.0959C15.3034 10.4919 15.2431 10.932 15.3099 11.362L16.9799 21.389C17.0682 21.9139 17.3413 22.3899 17.7499 22.7311C18.1586 23.0722 18.6757 23.2559 19.2079 23.249H28.7899C29.3224 23.2561 29.8397 23.0725 30.2486 22.7314C30.6574 22.3902 30.9306 21.9141 31.0189 21.389L32.6889 11.362C32.7561 10.9241 32.6914 10.4762 32.5029 10.0753C32.3145 9.67438 32.0109 9.33868 31.6309 9.11099"
        stroke={currentColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <G filter={active ? 'url(#filter0_d_22_3326)' : undefined}>
        <Path
          d="M18 30H30C30 31.1046 29.1046 32 28 32H20C18.8954 32 18 31.1046 18 30Z"
          fill={active ? currentColor : 'none'}
        />
      </G>
      {active && (
        <Defs>
          <Filter
            id="filter0_d_22_3326"
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
              result="effect1_dropShadow_22_3326"
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
              result="effect1_dropShadow_22_3326"
            />
            <FeBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_22_3326"
              result="shape"
            />
          </Filter>
        </Defs>
      )}
    </Svg>
  );
};

export default HomeIcon;
