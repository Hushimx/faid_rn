import { Avatar } from '@ui-kitten/components';
import { IMAGES } from 'common';
import { useState } from 'react';
import { IUserAvatar } from 'types';

const UserAvatar = (props: IUserAvatar) => {
  const { image } = props;
  const [isError, setIsError] = useState(false);

  // const isRemoteImage = image?.includes('http')
  // const isLocallPath =
  return (
    <Avatar
      source={isError ? IMAGES.service : image}
      size="medium"
      resizeMode="contain"
      onError={() => setIsError(true)}
      {...props}
    />
  );
};

export default UserAvatar;
