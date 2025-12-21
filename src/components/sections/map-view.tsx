import { Spinner } from '@ui-kitten/components';
import { Box } from 'common';
import { AppText } from 'components/atoms';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import Maps, {
  LatLng,
  Marker,
  MarkerDragStartEndEvent,
  Polygon,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {
  checkLocationPermission,
  getCurrentLocation,
  isInsideSaudiArabia,
  regionFrom,
  ShowSnackBar,
} from 'utils';
import SaudiArabiaGeo from '@assets/saudi-arabia.geo.json';

const defaultRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
interface IProps {
  style?: StyleProp<ViewStyle>;
  scrollEnabled?: boolean;
  zoomEnabled?: boolean;
  region?: IRegion;
  setLocationCoordinates?: (value: LatLng) => void;
  isMrkerDraggable?: boolean;
  onMapLoaded?: () => void;
  onUserSelectUnSupportedArea?: (value: boolean) => void;
}
interface IRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const MapView: FC<IProps> = ({
  style,
  scrollEnabled = true,
  zoomEnabled = true,
  region,
  isMrkerDraggable = false,
  setLocationCoordinates,
  onMapLoaded,
  onUserSelectUnSupportedArea,
}) => {
  const { t } = useTranslation();
  const [currentRegion, setCurrentRegion] = useState<IRegion>(
    region ? regionFrom(region?.latitude, region?.longitude) : defaultRegion,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationError, setIsLocationError] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState<LatLng[]>([]);

  useEffect(() => {
    if (!region) getCurretUserLocation();
  }, []);

  useEffect(() => {
    // GeoJSON uses [lng, lat]
    const coords = SaudiArabiaGeo?.features[0]?.geometry?.coordinates[0].map(
      ([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
      }),
    );

    setPolygonPoints(coords);
  }, []);

  const getCurretUserLocation = async () => {
    setIsLoading(true);
    const isLocationPermissionGranted = await checkLocationPermission();
    if (isLocationPermissionGranted) {
      const userLocation = await getCurrentLocation();
      setCurrentRegion(
        regionFrom(userLocation?.latitude, userLocation?.longitude),
      );
      if (onMapLoaded) onMapLoaded();
    } else {
      ShowSnackBar({
        type: 'error',
        text: t('locationError'),
      });
      setIsLocationError(true);
    }
    setIsLoading(false);
  };
  const onMarkerDragEnd = useCallback((event: MarkerDragStartEndEvent) => {
    const newCoordinate = event.nativeEvent.coordinate;

    const { latitude, longitude } = newCoordinate;

    if (!onUserSelectUnSupportedArea || !setLocationCoordinates) return;

    if (!isInsideSaudiArabia(latitude, longitude)) {
      onUserSelectUnSupportedArea(true);
      return;
    } else {
      onUserSelectUnSupportedArea(false);
    }
    setLocationCoordinates(newCoordinate);
  }, []);

  if (isLoading)
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <Spinner status="cotrol" />
      </Box>
    );
  if (isLocationError)
    return (
      <Box flex={1} alignItems="center" justifyContent="center" padding="m">
        <AppText variant="h6" fontWeight={'500'} textAlign="center">
          {t('locationPermissionNotGranted')}
        </AppText>
      </Box>
    );

  return (
    <Maps
      style={[
        {
          height: '100%',
          width: '100%',
        },
        style,
      ]}
      initialRegion={currentRegion}
      region={currentRegion}
      scrollEnabled={scrollEnabled}
      zoomEnabled={zoomEnabled}
      provider={PROVIDER_GOOGLE}
    >
      <Marker
        coordinate={{
          latitude: currentRegion.latitude,
          longitude: currentRegion.longitude,
        }}
        draggable={isMrkerDraggable}
        onDragEnd={onMarkerDragEnd}
      />

      {!!polygonPoints?.length && (
        <Polygon
          coordinates={polygonPoints}
          strokeColor="rgba(0,0,255,0.8)"
          fillColor="rgba(0,0,255,0.1)"
          strokeWidth={2}
        />
      )}
    </Maps>
  );
};

export default MapView;
