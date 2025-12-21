import { AppPresseble } from 'components/atoms';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Expand = ({
  color,
  onPress,
}: {
  color?: string;
  onPress?: () => void;
}) => {
  return (
    <AppPresseble onPress={onPress}>
      <FontAwesome5 name="expand" size={30} color={color} />
    </AppPresseble>
  );
};
export default Expand;
