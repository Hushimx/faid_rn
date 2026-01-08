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
  
  // Default to center of Saudi Arabia if coordinates are invalid
  const defaultLatitude = 24.7136;
  const defaultLongitude = 46.6753;
  
  const isValidCoordinate = 
    latitude != null && 
    longitude != null &&
    typeof latitude === 'number' && 
    typeof longitude === 'number' &&
    !isNaN(latitude) && 
    !isNaN(longitude);
  
  const mapLatitude = isValidCoordinate ? latitude : defaultLatitude;
  const mapLongitude = isValidCoordinate ? longitude : defaultLongitude;

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppHeader label={t('mapView')} />
      <Box flex={1}>
        <MapView
          key={`${mapLatitude}-${mapLongitude}`}
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: mapLatitude,
            longitude: mapLongitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={true}
          zoomEnabled={true}
        >
          {isValidCoordinate && (
            <Marker
              coordinate={{
                latitude: mapLatitude,
                longitude: mapLongitude,
              }}
            />
          )}
        </MapView>
      </Box>
    </Box>
  );
};

export default FullScreenMapView;
