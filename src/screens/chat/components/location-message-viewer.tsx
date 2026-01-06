import { Box } from 'common';
import { AppText } from 'components';
import { useRef } from 'react';
import { Modal, StatusBar, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface LocationMessageViewerProps {
  location: {
    latitude: number;
    longitude: number;
  };
  visible: boolean;
  onClose: () => void;
}

const LocationMessageViewer = ({
  location,
  visible,
  onClose,
}: LocationMessageViewerProps) => {
  const mapRef = useRef<MapView>(null);
  const { latitude, longitude } = location;

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
      </Box>
    </Modal>
  );
};

export default LocationMessageViewer;

