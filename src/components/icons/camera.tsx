import Ionicons from 'react-native-vector-icons/Ionicons';

interface CameraProps {
  size?: number;
  color?: string;
}

const Camera = ({ size = 22, color }: CameraProps) => {
  return <Ionicons name="camera-outline" size={size} color={color} />;
};

export default Camera;
