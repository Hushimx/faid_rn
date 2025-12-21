import { FC } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface IProps {
  color?: string;
}

const Star: FC<IProps> = ({ color }) => {
  return <AntDesign name="star" size={20} color={color} />;
};

export default Star;
