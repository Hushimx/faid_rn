import { Avatar } from '@ui-kitten/components';
import { IMAGES } from 'common';
import { useState } from 'react';
import { IUserAvatar } from 'types';

const UserAvatar = (props: IUserAvatar) => {
  const { image } = props;
  const [isError, setIsError] = useState(false);

  // Convert image to proper source format
  // If it's a string, check if it's a local file URI (file://, content://) or remote URL (http://, https://)
  // Local file URIs need to be objects with { uri: string }
  // Remote URLs can be strings or objects with { uri: string }
  const getImageSource = () => {
    if (isError) {
      return IMAGES.service;
    }
    if (!image) {
      return IMAGES.service;
    }
    // If image is already an object (like { uri: '...' }), use it directly
    if (typeof image === 'object' && 'uri' in image) {
      return image;
    }
    // If image is a string, check if it's a local file URI
    if (typeof image === 'string') {
      // Local file URIs (file://, content://, ph://) need to be objects
      if (image.startsWith('file://') || image.startsWith('content://') || image.startsWith('ph://')) {
        return { uri: image };
      }
      // Remote URLs can be strings or objects, but UI Kitten Avatar might prefer objects
      // For consistency, convert to object
      return { uri: image };
    }
    return IMAGES.service;
  };

  return (
    <Avatar
      source={getImageSource()}
      size="medium"
      resizeMode="cover"
      onError={() => setIsError(true)}
      {...props}
    />
  );
};

export default UserAvatar;
