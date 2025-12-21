import { AvatarProps } from '@ui-kitten/components';

export interface IUserAvatar extends AvatarProps {
  image?: string | null;
}

export interface IconProps {
  size?: number;
  color?: string;
  active?: boolean;
}
