import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
  style?: object;
  /** Controls if the eye is showing (open) or hidden (closed) */
  isVisible?: boolean;
  /** Callback when the eye icon is pressed */
  onPress?: () => void;
  /** Optional props to customize the touchable behavior */
  touchableProps?: Omit<TouchableOpacityProps, 'onPress' | 'style'>;
};

const Eye: React.FC<Props> = ({
  size = 24,
  color = '#464F67',
  style,
  isVisible = false,
  onPress,
  touchableProps,
}) => {
  const renderIcon = () => {
    if (isVisible) {
      return (
        <Svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          style={style}
        >
          <Path
            d="M12 5C8.24261 5 5.43602 7.4404 3.76825 9.43934C2.51591 10.9394 2.51591 13.0606 3.76825 14.5607C5.43602 16.5596 8.24261 19 12 19C15.7574 19 18.564 16.5596 20.2317 14.5607C21.4841 13.0606 21.4841 10.9394 20.2317 9.43934C18.564 7.4404 15.7574 5 12 5Z"
            stroke={color}
            strokeWidth={1}
            fill="none"
          />
          <Path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke={color}
            strokeWidth={1}
            fill="none"
          />
        </Svg>
      );
    }

    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
      >
        <Path
          d="M10.73 5.073C11.1516 5.02419 11.5756 4.99982 12 5C16.664 5 20.4 7.903 22 12C21.6126 12.9966 21.0893 13.9348 20.445 14.788M6.52 6.519C4.48 7.764 2.9 9.693 2 12C3.6 16.097 7.336 19 12 19C13.9321 19.0102 15.8292 18.484 17.48 17.48M9.88 9.88C9.6014 10.1586 9.3804 10.4893 9.22963 10.8534C9.07885 11.2174 9.00125 11.6075 9.00125 12.0015C9.00125 12.3955 9.07885 12.7856 9.22963 13.1496C9.3804 13.5137 9.6014 13.8444 9.88 14.123C10.1586 14.4016 10.4893 14.6226 10.8534 14.7734C11.2174 14.9242 11.6075 15.0018 12.0015 15.0018C12.3955 15.0018 12.7856 14.9242 13.1496 14.7734C13.5137 14.6226 13.8444 14.4016 14.123 14.123"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          fill="none"
        />
        <Path
          d="M4 4L20 20"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={1}
        />
      </Svg>
    );
  };

  if (!onPress) {
    return renderIcon();
  }

  return (
    <TouchableOpacity onPress={onPress} {...touchableProps}>
      {renderIcon()}
    </TouchableOpacity>
  );
};

export default Eye;
