import { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Maps, { Marker } from 'react-native-maps';

interface IProps {
  style?: StyleProp<ViewStyle>;
  scrollEnabled?: boolean;
  zoomEnabled?: boolean;
}

const MapView: FC<IProps> = ({
  style,
  scrollEnabled = true,
  zoomEnabled = true,
}) => {
  const region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  return (
    <Maps
      style={[
        {
          flex: 1,
        },
        style,
      ]}
      initialRegion={region}
      region={region}
      scrollEnabled={scrollEnabled}
      zoomEnabled={zoomEnabled}
    >
      <Marker
        coordinate={{
          latitude: region.latitude,
          longitude: region.longitude,
        }}
        // title="Location"
        // description="Service location"
      />
    </Maps>
  );
};

export default MapView;
