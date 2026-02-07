import { Box } from 'common';
import { AppPresseble, AppText } from 'components';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Modal, Platform, StatusBar, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface LocationMessageViewerProps {
  location: {
    latitude: number;
    longitude: number;
  };
  visible: boolean;
  onClose: () => void;
}

const getOpenInMapsUrl = (lat: number, lng: number) => {
  if (Platform.OS === 'ios') {
    return `https://maps.apple.com/?q=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};

const LocationMessageViewer = ({
  location,
  visible,
  onClose,
}: LocationMessageViewerProps) => {
  const { t } = useTranslation();
  const mapRef = useRef<MapView>(null);
  const { latitude, longitude } = location;

  const handleOpenInMaps = () => {
    const url = getOpenInMapsUrl(latitude, longitude);
    Linking.openURL(url).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" />
      <Box flex={1} backgroundColor="cutomBlack">
        {visible && (
          <MapView
            ref={mapRef}
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
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            />
          </MapView>
        )}
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AppText color="white" fontSize={24}>
            ✕
          </AppText>
        </TouchableOpacity>
        <AppPresseble
          onPress={handleOpenInMaps}
          style={{
            position: 'absolute',
            bottom: 40,
            left: 20,
            right: 20,
            backgroundColor: 'rgba(0,0,0,0.7)',
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
      </Box>
    </Modal>
  );
};

export default LocationMessageViewer;

