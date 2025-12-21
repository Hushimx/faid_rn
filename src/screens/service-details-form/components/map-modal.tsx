import { Box } from 'common';
import {
  AppButton,
  AppErrorMessage,
  AppSpacer,
  AppText,
  BaseModal,
  MapView,
} from 'components';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { LatLng } from 'react-native-maps';
import { IModalRef } from 'types';

interface IProps {
  onSelectLocation?: (location: LatLng) => void;
}

const MapModal = forwardRef<IModalRef, IProps>(({ onSelectLocation }, ref) => {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const [locationCoordinates, setLocationCoordinates] = useState<LatLng | null>(
    null,
  );
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isUnSupportedAreaSelected, setIsUnSupportedAreaSelected] =
    useState(false);

  const handleSelectLocation = () => {
    if (locationCoordinates) onSelectLocation?.(locationCoordinates);
    (ref as any)?.current?.closeModal();
  };

  return (
    <BaseModal ref={ref}>
      <Box paddingHorizontal="m">
        <AppSpacer variant="s" />
        <AppText variant="h3" fontWeight="700">
          {t('selectLocation')}
        </AppText>
        <AppSpacer variant="s" />
        <MapView
          style={{
            height: height * 0.5,
            width: '100%',
            borderRadius: 12,
          }}
          isMrkerDraggable
          setLocationCoordinates={coordinates =>
            setLocationCoordinates(coordinates)
          }
          onMapLoaded={() => setIsMapLoaded(true)}
          onUserSelectUnSupportedArea={value =>
            setIsUnSupportedAreaSelected(value)
          }
        />
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
    </BaseModal>
  );
});

export default MapModal;
