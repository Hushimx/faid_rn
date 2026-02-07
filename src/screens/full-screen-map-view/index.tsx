import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box } from 'common';
import { AppHeader, AppPresseble, AppText } from 'components';
import { useTranslation } from 'react-i18next';
import { Linking, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { RootStackParamList } from 'types';

const getOpenInMapsUrl = (lat: number, lng: number) => {
  if (Platform.OS === 'ios') {
    return `https://maps.apple.com/?q=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};

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

  const handleOpenInMaps = () => {
    const url = getOpenInMapsUrl(mapLatitude, mapLongitude);
    Linking.openURL(url).catch(() => {});
  };

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppHeader label={t('mapView')} />
      <Box flex={1} position="relative">
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
        {isValidCoordinate && (
          <AppPresseble
            onPress={handleOpenInMaps}
            style={{
              position: 'absolute',
              bottom: 32,
              left: 20,
              right: 20,
              backgroundColor: 'rgba(0,0,0,0.75)',
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText color="white" variant="m" fontWeight="600">
              {t('openInMaps')}
            </AppText>
          </AppPresseble>
        )}
      </Box>
    </Box>
  );
};

export default FullScreenMapView;
