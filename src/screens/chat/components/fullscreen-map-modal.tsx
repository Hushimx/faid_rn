import { Box } from 'common';
import {
  AppButton,
  AppErrorMessage,
  AppPresseble,
  AppSpacer,
  AppText,
  MapView,
} from 'components';
import { useDebounce } from 'hooks';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, StatusBar, TextInput, useWindowDimensions } from 'react-native';
import { LatLng } from 'react-native-maps';
import { IModalRef } from 'types';
import { forwardGeocode, GeocodeResult, regionFrom, reverseGeocode } from 'utils';

interface IProps {
  onSelectLocation?: (_location: LatLng & { address?: string }) => void;
}

const FullscreenMapModal = forwardRef<IModalRef, IProps>(
  ({ onSelectLocation }, ref) => {
    const { t } = useTranslation();
    const { height, width } = useWindowDimensions();
    const [visible, setVisible] = useState(false);
    const [locationCoordinates, setLocationCoordinates] = useState<LatLng | null>(
      null,
    );
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isUnSupportedAreaSelected, setIsUnSupportedAreaSelected] =
      useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState<{
      latitude: number;
      longitude: number;
    } | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const debouncedSearch = useDebounce(searchQuery, 500);
    const lastCoordinatesRef = useRef<LatLng | null>(null);

    useImperativeHandle(ref, () => ({
      openModal: () => {
        setVisible(true);
        setLocationCoordinates(null);
        setSelectedAddress('');
        setSearchQuery('');
      },
      closeModal: () => {
        setVisible(false);
      },
      reset: () => {},
      snapToIndexZero: () => {},
    }));

    const handleLocationCoordinatesChange = useCallback(
      async (coordinates: LatLng) => {
        // Prevent infinite loop by checking if coordinates actually changed
        if (
          lastCoordinatesRef.current &&
          Math.abs(
            lastCoordinatesRef.current.latitude - coordinates.latitude,
          ) < 0.0001 &&
          Math.abs(
            lastCoordinatesRef.current.longitude - coordinates.longitude,
          ) < 0.0001
        ) {
          return;
        }

        lastCoordinatesRef.current = coordinates;
        setLocationCoordinates(coordinates);
        
        // Try to get address for the selected location
        try {
          const reverseResult = await reverseGeocode(
            coordinates.latitude,
            coordinates.longitude,
          );
          if (reverseResult?.display_name) {
            setSelectedAddress(reverseResult.display_name);
          }
        } catch (error) {
          // Silently fail - address is optional
        }
      },
      [],
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

    const handleSelectLocation = async () => {
      if (locationCoordinates) {
        // Get address for the location
        let address = selectedAddress || searchQuery || '';
        if (!address && locationCoordinates) {
          // Try to get address from reverse geocoding
          try {
            const reverseResult = await reverseGeocode(
              locationCoordinates.latitude,
              locationCoordinates.longitude,
            );
            if (reverseResult?.display_name) {
              address = reverseResult.display_name;
            } else {
              address = `${locationCoordinates.latitude}, ${locationCoordinates.longitude}`;
            }
          } catch (error) {
            // Fallback to coordinates if reverse geocoding fails
            address = `${locationCoordinates.latitude}, ${locationCoordinates.longitude}`;
          }
        }

        onSelectLocation?.({
          ...locationCoordinates,
          address,
        });
        setVisible(false);
      }
    };

    const handleSelectSearchResult = (result: GeocodeResult) => {
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      setSelectedRegion({ latitude: lat, longitude: lon });
      setLocationCoordinates({ latitude: lat, longitude: lon });
      setSelectedAddress(result.display_name);
      // Clear search query and results immediately to prevent rerender issues
      setSearchQuery('');
      setSearchResults([]);
    };

    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setVisible(false)}
      >
        <StatusBar barStyle="dark-content" />
        <Box flex={1} paddingHorizontal="m" paddingTop="m" backgroundColor="white">
          <AppSpacer variant="s" />
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <AppText variant="h3" fontWeight="700">
              {t('selectLocation') || 'Select Location'}
            </AppText>
            <AppPresseble onPress={() => setVisible(false)}>
              <AppText variant="h4" color="primary">
                {t('cancel') || 'Cancel'}
              </AppText>
            </AppPresseble>
          </Box>
          <AppSpacer variant="s" />

          {/* Search Input */}
          <Box
            flexDirection="row"
            alignItems="center"
            backgroundColor="grayLight"
            borderRadius={12}
            paddingHorizontal="m"
            borderWidth={1}
            borderColor="grayLight"
          >
            <AppText variant="s2" color="grayDark" marginRight="s">
              🔍
            </AppText>
            <TextInput
              placeholder={t('searchLocation') || 'ابحث عن موقع...'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                paddingVertical: 12,
                fontSize: 14,
              }}
              placeholderTextColor="#999"
            />
          </Box>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Box
              maxHeight={150}
              backgroundColor="white"
              borderRadius={12}
              marginTop="s"
              borderWidth={1}
              borderColor="grayLight"
              zIndex={1000}
              position="absolute"
              top={100}
              left="m"
              right="m"
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
            <Box alignItems="center" paddingVertical="s">
              <AppText variant="s2" color="grayDark">
                {t('searching') || 'جاري البحث...'}
              </AppText>
            </Box>
          )}

          <AppSpacer variant="s" />
          {/* Full Screen Map */}
          <Box flex={1} borderRadius={12} overflow="hidden">
            <MapView
              style={{
                height: '100%',
                width: '100%',
              }}
              isMrkerDraggable
              region={
                selectedRegion
                  ? regionFrom(selectedRegion.latitude, selectedRegion.longitude)
                  : undefined
              }
              setLocationCoordinates={handleLocationCoordinatesChange}
              onMapLoaded={() => setIsMapLoaded(true)}
              onUserSelectUnSupportedArea={value =>
                setIsUnSupportedAreaSelected(value)
              }
            />
          </Box>
          <AppSpacer variant="s" />
          <AppErrorMessage
            text={t('unsupportedAreaError')}
            isError={isUnSupportedAreaSelected}
          />
          {selectedAddress && (
            <Box
              backgroundColor="grayLight"
              padding="s"
              borderRadius={8}
              marginTop="s"
            >
              <AppText variant="s2" numberOfLines={2}>
                {selectedAddress}
              </AppText>
            </Box>
          )}
          <AppSpacer variant="m" />
          <AppButton
            label={t('confirmLocation') || 'Confirm Location'}
            onPress={handleSelectLocation}
            isFullWidth
            disabled={!isMapLoaded || isUnSupportedAreaSelected}
          />
          <AppSpacer variant="s" />
        </Box>
      </Modal>
    );
  },
);

FullscreenMapModal.displayName = 'FullscreenMapModal';

export default FullscreenMapModal;

