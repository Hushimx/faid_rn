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

const MarketplaceIcon = ({
  size = 48,
  color = '#2344CD',
  active = false,
}: IconProps) => {
  const inactiveColor = '#262626';
  const activeColor = color;
  const currentColor = active ? activeColor : inactiveColor;

  return (
    <Svg width={size} height={size * 0.792} viewBox="0 0 48 38" fill="none">
      <G transform="translate(11, 0)">
        <Path
          d="M4.875 15.1875H8.9375M8.9375 15.1875V12.75M8.9375 15.1875H13M13 15.1875V12.75M13 15.1875H17.0625M17.0625 15.1875V12.75M17.0625 15.1875H21.125M10.5625 18.4375H12.1875M13.8125 18.4375H15.4375M13.8125 20.875H15.4375M10.5625 20.875H12.1875M5.6875 24.9375V15.1875H4.0625V11.9375L6.5 7.0625H19.5L21.9375 11.9375V15.1875H20.3125V24.9375H5.6875Z"
          stroke={currentColor}
          strokeWidth={1.625}
          strokeLinejoin="round"
        />
      </G>
      <G filter={active ? 'url(#filter0_d_marketplace)' : undefined}>
        <Path
          d="M18 30H30C30 31.1046 29.1046 32 28 32H20C18.8954 32 18 31.1046 18 30Z"
          fill={active ? currentColor : 'none'}
        />
      </G>
      {active && (
        <Defs>
          <Filter
            id="filter0_d_marketplace"
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
              result="effect1_dropShadow_marketplace"
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
              result="effect1_dropShadow_marketplace"
            />
            <FeBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_marketplace"
              result="shape"
            />
          </Filter>
        </Defs>
      )}
    </Svg>
  );
};

export default MarketplaceIcon;
