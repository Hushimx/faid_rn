import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box } from 'common';
import { AppHeader } from 'components';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { RootStackParamList } from 'types';

const FullScreenMapView = (
  props: NativeStackScreenProps<RootStackParamList, 'FullScreenMapView'>,
) => {
  const { t } = useTranslation();
  const { latitude, longitude } = props?.route?.params || {};

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppHeader label={t('mapView')} />
      <Box flex={1}>
        <MapView
          key={`${latitude}-${longitude}`}
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={true}
          zoomEnabled={true}
        >
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
          />
        </MapView>
      </Box>
    </Box>
  );
};

export default FullScreenMapView;
