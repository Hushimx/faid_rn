import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface IProps {
  size?: number;
  color?: string;
}

const Trash = ({ size = 20, color = 'red' }: IProps) => {
  return <FontAwesome5 name="trash" color={color} size={size} />;
};
export default Trash;
