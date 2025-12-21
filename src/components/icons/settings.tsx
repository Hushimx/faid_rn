import * as React from 'react';
import Svg, {
  Defs,
  FeBlend,
  FeColorMatrix,
  FeComposite,
  FeFlood,
  FeGaussianBlur,
  FeMorphology,
  FeOffset,
  Filter,
  Path,
  G,
} from 'react-native-svg';
import { IconProps } from '../../types/atoms';

const SettingsIcon = ({
  size = 48,
  color = '#2344CD',
  active = false,
}: IconProps) => {
  const inactiveColor = '#262626';
  const activeColor = color;
  const currentColor = active ? activeColor : inactiveColor;

  return (
    <Svg width={size} height={size * 0.792} viewBox="0 0 48 38" fill="none">
      <G transform="translate(12, 0)">
        <Path
          d="M12 22.63C11.33 22.63 10.65 22.48 10.12 22.17L4.61999 19C2.37999 17.49 2.23999 17.26 2.23999 14.89V9.11005C2.23999 6.74005 2.36999 6.51005 4.56999 5.02005L10.11 1.82005C11.16 1.21005 12.81 1.21005 13.86 1.82005L19.38 5.00005C21.62 6.51005 21.76 6.74005 21.76 9.11005V14.88C21.76 17.25 21.63 17.48 19.43 18.97L13.89 22.17C13.35 22.48 12.67 22.63 12 22.63ZM12 2.87005C11.58 2.87005 11.17 2.95005 10.88 3.12005L5.37999 6.30005C3.74999 7.40005 3.74999 7.40005 3.74999 9.11005V14.88C3.74999 16.59 3.74999 16.59 5.41999 17.72L10.88 20.8701C11.47 21.2101 12.54 21.2101 13.13 20.8701L18.63 17.6901C20.25 16.59 20.25 16.59 20.25 14.88V9.11005C20.25 7.40005 20.25 7.40005 18.58 6.27005L13.12 3.12005C12.83 2.95005 12.42 2.87005 12 2.87005Z"
          fill={currentColor}
        />
        <Path
          d="M12 15.75C9.93 15.75 8.25 14.07 8.25 12C8.25 9.93 9.93 8.25 12 8.25C14.07 8.25 15.75 9.93 15.75 12C15.75 14.07 14.07 15.75 12 15.75ZM12 9.75C10.76 9.75 9.75 10.76 9.75 12C9.75 13.24 10.76 14.25 12 14.25C13.24 14.25 14.25 13.24 14.25 12C14.25 10.76 13.24 9.75 12 9.75Z"
          fill={currentColor}
        />
      </G>
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

export default SettingsIcon;
