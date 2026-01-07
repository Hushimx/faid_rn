import { Spinner } from '@ui-kitten/components';
import { Box } from 'common';
import { AppText } from 'components/atoms';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import Maps, {
  LatLng,
  MapPressEvent,
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
  setLocationCoordinates?: (_value: LatLng) => void;
  isMrkerDraggable?: boolean;
  onMapLoaded?: () => void;
  onUserSelectUnSupportedArea?: (_value: boolean) => void;
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
  const [markerCoordinate, setMarkerCoordinate] = useState<LatLng>({
    latitude: region?.latitude || defaultRegion.latitude,
    longitude: region?.longitude || defaultRegion.longitude,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationError, setIsLocationError] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState<LatLng[]>([]);
  const isInternalUpdateRef = useRef(false);
  const lastRegionRef = useRef<IRegion | null>(null);

  useEffect(() => {
    if (!region) getCurretUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (region) {
      const newRegion = regionFrom(region.latitude, region.longitude);
      
      // Check if region actually changed to avoid unnecessary updates
      const regionChanged =
        !lastRegionRef.current ||
        Math.abs(lastRegionRef.current.latitude - newRegion.latitude) > 0.0001 ||
        Math.abs(lastRegionRef.current.longitude - newRegion.longitude) > 0.0001;

      if (regionChanged) {
        // Check if the new region matches the current marker position
        // If it does, this update likely came from handleLocationUpdate, so don't call setLocationCoordinates again
        const matchesMarker =
          Math.abs(markerCoordinate.latitude - region.latitude) < 0.0001 &&
          Math.abs(markerCoordinate.longitude - region.longitude) < 0.0001;

        lastRegionRef.current = newRegion;
        setCurrentRegion(newRegion);
        setMarkerCoordinate({
          latitude: region.latitude,
          longitude: region.longitude,
        });

        // Only call setLocationCoordinates if this is an external update (region doesn't match current marker)
        // This prevents infinite loop when handleLocationUpdate triggers region prop change
        // Also check the ref flag to be extra safe
        if (setLocationCoordinates && !matchesMarker && !isInternalUpdateRef.current) {
          setLocationCoordinates({
            latitude: region.latitude,
            longitude: region.longitude,
          });
        }

        if (onUserSelectUnSupportedArea) {
          const isUnsupported = !isInsideSaudiArabia(
            region.latitude,
            region.longitude,
          );
          onUserSelectUnSupportedArea(isUnsupported);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

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
      if (userLocation) {
        setCurrentRegion(
          regionFrom(userLocation.latitude, userLocation.longitude),
        );
        setMarkerCoordinate({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        });
      }
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
  const handleLocationUpdate = useCallback(
    (coordinate: LatLng) => {
      const { latitude, longitude } = coordinate;

      if (!setLocationCoordinates) return;

      // Mark this as an internal update to prevent infinite loop
      isInternalUpdateRef.current = true;

      // Update marker position immediately for smooth interaction
      // Don't update the region - let the user keep their current view
      setMarkerCoordinate(coordinate);

      // Check if location is inside Saudi Arabia
      if (onUserSelectUnSupportedArea) {
        if (!isInsideSaudiArabia(latitude, longitude)) {
          onUserSelectUnSupportedArea(true);
          // Reset ref after a short delay to allow useEffect to process
          setTimeout(() => {
            isInternalUpdateRef.current = false;
          }, 50);
          return;
        } else {
          onUserSelectUnSupportedArea(false);
        }
      }

      // Update location coordinates only - don't update region to avoid centering
      setLocationCoordinates(coordinate);
      
      // Reset ref after a short delay to allow useEffect to process
      setTimeout(() => {
        isInternalUpdateRef.current = false;
      }, 50);
    },
    [onUserSelectUnSupportedArea, setLocationCoordinates],
  );

  const onMarkerDragEnd = useCallback(
    (event: MarkerDragStartEndEvent) => {
      const newCoordinate = event.nativeEvent.coordinate;
      handleLocationUpdate(newCoordinate);
    },
    [handleLocationUpdate],
  );

  const onMapPress = useCallback(
    (event: MapPressEvent) => {
      const newCoordinate = event.nativeEvent.coordinate;
      handleLocationUpdate(newCoordinate);
    },
    [handleLocationUpdate],
  );

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
      region={region ? regionFrom(region.latitude, region.longitude) : currentRegion}
      scrollEnabled={scrollEnabled}
      zoomEnabled={zoomEnabled}
      provider={PROVIDER_GOOGLE}
      onPress={setLocationCoordinates ? onMapPress : undefined}
      moveOnMarkerPress={false}
      pitchEnabled={false}
      rotateEnabled={false}
      showsUserLocation={false}
      onRegionChangeComplete={(newRegion) => {
        // Update currentRegion when user manually pans/zooms
        // This keeps the map state in sync without forcing updates
        if (!isInternalUpdateRef.current) {
          setCurrentRegion({
            latitude: newRegion.latitude,
            longitude: newRegion.longitude,
            latitudeDelta: newRegion.latitudeDelta,
            longitudeDelta: newRegion.longitudeDelta,
          });
        }
      }}
    >
      <Marker
        coordinate={markerCoordinate}
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
