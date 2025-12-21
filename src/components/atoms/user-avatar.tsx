import { Avatar } from '@ui-kitten/components';
import { IMAGES } from 'common';
import { IUserAvatar } from 'types';

const UserAvatar = (props: IUserAvatar) => {
  const { image } = props;
  // const isRemoteImage = image?.includes('http')
  // const isLocallPath =
  return (
    <Avatar
      source={image ? { uri: image } : IMAGES.user}
      size="medium"
      resizeMode="contain"
      {...props}
    />
  );
};

export default UserAvatar;
