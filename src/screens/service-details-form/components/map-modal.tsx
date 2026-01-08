import { Box } from 'common';
import {
  AppButton,
  AppErrorMessage,
  AppPresseble,
  AppSpacer,
  AppText,
  BaseModal,
} from 'components';
import { useDebounce } from 'hooks';
import { forwardRef, useCallback, useEffect, useRef, useState, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, useWindowDimensions, View } from 'react-native';
import MapView, { LatLng, MapPressEvent, Marker, MarkerDragStartEndEvent, PROVIDER_GOOGLE } from 'react-native-maps';
import { IModalRef } from 'types';
import { forwardGeocode, GeocodeResult, isInsideSaudiArabia } from 'utils';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

interface IProps {
  onSelectLocation?: (_location: LatLng) => void;
  initialLocation?: { latitude: number; longitude: number } | null;
}

const MapModal = forwardRef<IModalRef, IProps>(({ onSelectLocation, initialLocation }, ref) => {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const [locationCoordinates, setLocationCoordinates] = useState<LatLng | null>(
    initialLocation || null,
  );
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isUnSupportedAreaSelected, setIsUnSupportedAreaSelected] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const lastCoordinatesRef = useRef<LatLng | null>(initialLocation || null);
  const modalRef = useRef<IModalRef>(null);
  const mapRef = useRef<MapView>(null);
  const initialLocationRef = useRef(initialLocation);
  const [mapKey, setMapKey] = useState(0);
  const [shouldCenterOnOpen, setShouldCenterOnOpen] = useState(false);

  // Keep ref in sync with prop
  useEffect(() => {
    initialLocationRef.current = initialLocation;
    if (initialLocation) {
      setLocationCoordinates(initialLocation);
      lastCoordinatesRef.current = initialLocation;
    }
  }, [initialLocation]);

  // Forward ref methods to parent
  useImperativeHandle(ref, () => ({
    openModal: () => {
      const locationToSet = initialLocationRef.current || null;
      setLocationCoordinates(locationToSet);
      lastCoordinatesRef.current = locationToSet;
      setIsMapLoaded(false);
      setSearchQuery('');
      setSearchResults([]);
      // Set flag to center on open
      setShouldCenterOnOpen(true);
      // Force remount to apply initialRegion
      setMapKey(prev => prev + 1);
      if (modalRef.current) {
        modalRef.current.openModal();
      }
    },
    closeModal: () => {
      setShouldCenterOnOpen(false);
      if (modalRef.current) {
        modalRef.current.closeModal();
      }
    },
  }));

  const handleLocationUpdate = useCallback(
    (coordinates: LatLng) => {
      // Prevent infinite loop by checking if coordinates actually changed
      if (
        lastCoordinatesRef.current &&
        Math.abs(lastCoordinatesRef.current.latitude - coordinates.latitude) <
          0.0001 &&
        Math.abs(lastCoordinatesRef.current.longitude - coordinates.longitude) <
          0.0001
      ) {
        return;
      }

      const { latitude, longitude } = coordinates;

      // Check if location is inside Saudi Arabia
      if (!isInsideSaudiArabia(latitude, longitude)) {
        setIsUnSupportedAreaSelected(true);
        return;
      } else {
        setIsUnSupportedAreaSelected(false);
      }

      lastCoordinatesRef.current = coordinates;
      setLocationCoordinates(coordinates);
    },
    [],
  );

  const handleMapPress = useCallback(
    (event: MapPressEvent) => {
      const coordinates = event.nativeEvent.coordinate;
      handleLocationUpdate(coordinates);
    },
    [handleLocationUpdate],
  );

  const handleMarkerDragEnd = useCallback(
    (event: MarkerDragStartEndEvent) => {
      const coordinates = event.nativeEvent.coordinate;
      handleLocationUpdate(coordinates);
    },
    [handleLocationUpdate],
  );

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearch || debouncedSearch.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      const results = await forwardGeocode(debouncedSearch);
      setSearchResults(results);
      setIsSearching(false);
    };

    performSearch();
  }, [debouncedSearch]);

  const handleSelectLocation = () => {
    if (locationCoordinates) onSelectLocation?.(locationCoordinates);
    modalRef.current?.closeModal();
  };

  const handleSelectSearchResult = (result: GeocodeResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    const newLocation = { latitude: lat, longitude: lon };
    setLocationCoordinates(newLocation);
    lastCoordinatesRef.current = newLocation;
    // Clear search query and results immediately to prevent rerender issues
    setSearchQuery('');
    setSearchResults([]);
    
    // Animate map to new location when searching (user wants to see the result)
    mapRef.current?.animateToRegion({
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 500);
  };

  return (
    <BaseModal ref={modalRef} enableContentPanningGesture={false}>
      <BottomSheetScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={false}
      >
        <Box paddingHorizontal="m">
          <AppSpacer variant="s" />
          <AppText variant="h3" fontWeight="700">
            {t('selectLocation')}
          </AppText>
          <AppSpacer variant="s" />

          {/* Search Input */}
          <BaseModal.Input
            placeholder={t('searchLocation') || 'ابحث عن موقع...'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            isSearch
          />

          <AppSpacer variant="s" />
          {/* Map View - matching location-message-viewer pattern */}
          <View
            style={{
              height: height * 0.55,
              width: '100%',
              borderRadius: 12,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Search Results - Absolutely positioned above map */}
            {searchResults.length > 0 && (
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                zIndex={1000}
                maxHeight={150}
                backgroundColor="white"
                borderRadius={12}
                marginHorizontal="m"
                marginTop="s"
                borderWidth={1}
                borderColor="grayLight"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <FlatList
                  data={searchResults}
                  keyExtractor={item => item.place_id.toString()}
                  renderItem={({ item }) => (
                    <AppPresseble
                      onPress={() => handleSelectSearchResult(item)}
                      style={{
                        padding: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: '#f0f0f0',
                      }}
                    >
                      <AppText variant="s2" numberOfLines={2}>
                        {item.display_name}
                      </AppText>
                    </AppPresseble>
                  )}
                  keyboardShouldPersistTaps="handled"
                />
              </Box>
            )}

            {isSearching && (
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                zIndex={1000}
                alignItems="center"
                paddingVertical="s"
                backgroundColor="white"
                borderRadius={12}
                marginHorizontal="m"
                marginTop="s"
              >
                <AppText variant="s2" color="grayDark">
                  {t('searching') || 'جاري البحث...'}
                </AppText>
              </Box>
            )}
            <MapView
              ref={mapRef}
              key={`map-${mapKey}`}
              style={{ flex: 1 }}
              provider={PROVIDER_GOOGLE}
              initialRegion={
                shouldCenterOnOpen && locationCoordinates
                  ? {
                      latitude: locationCoordinates.latitude,
                      longitude: locationCoordinates.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }
                  : {
                      // Default to center of Saudi Arabia
                      latitude: 24.7136,
                      longitude: 46.6753,
                      latitudeDelta: 0.5,
                      longitudeDelta: 0.5,
                    }
              }
              scrollEnabled={true}
              zoomEnabled={true}
              onPress={handleMapPress}
              onMapReady={() => {
                setIsMapLoaded(true);
                // Reset flag after map is ready
                setShouldCenterOnOpen(false);
              }}
            >
              {locationCoordinates && (
                <Marker
                  coordinate={{
                    latitude: locationCoordinates.latitude,
                    longitude: locationCoordinates.longitude,
                  }}
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                />
              )}
            </MapView>
          </View>
          <AppSpacer variant="s" />
          <AppErrorMessage
            text={t('unsupportedAreaError')}
            isError={isUnSupportedAreaSelected}
          />
          <AppSpacer variant="m" />
          <AppButton
            label={t('confirmLocation')}
            onPress={handleSelectLocation}
            isFullWidth
            disabled={!isMapLoaded || isUnSupportedAreaSelected}
          />
          <AppSpacer variant="s" />
        </Box>
      </BottomSheetScrollView>
    </BaseModal>
  );
});

export default MapModal;

