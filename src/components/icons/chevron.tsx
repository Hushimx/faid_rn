import { I18nManager, StyleProp, ViewStyle } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const Chevron = ({
  size = 25,
  styles,
  color,
}: {
  size?: number;
  styles?: StyleProp<ViewStyle>;
  color?: string;
}) => {
  return (
    <Entypo
      name={I18nManager.isRTL ? 'chevron-thin-left' : 'chevron-thin-right'}
      size={size}
      style={styles}
      color={color}
    />
  );
};

export default Chevron;
