import { IMAGES } from 'common';
import { FC, useState } from 'react';
import {
  Image,
  ImageProps,
  ImageStyle,
  ImageURISource,
  StyleProp,
} from 'react-native';

interface IProps extends ImageProps {
  source: ImageURISource;
  style?: StyleProp<ImageStyle>;
}
const AppImage: FC<IProps> = ({ source, style, ...props }) => {
  const [isError, setIsError] = useState(false);
  return (
    <Image
      source={
        isError || (typeof source === 'object' && !source?.uri)
          ? IMAGES.service
          : source
      }
      onError={() => setIsError(true)}
      style={style}
      {...props}
    />
  );
};

export default AppImage;
