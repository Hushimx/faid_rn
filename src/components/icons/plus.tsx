import AntDesign from 'react-native-vector-icons/AntDesign';

const Plus = ({ color, size = 25 }: { color?: string; size?: number }) => {
  return <AntDesign name="plus" size={size} color={color} />;
};
export default Plus;
