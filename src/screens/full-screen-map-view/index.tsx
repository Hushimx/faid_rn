import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box } from 'common';
import { AppHeader, MapView } from 'components';
import { useTranslation } from 'react-i18next';
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
          style={{ height: '100%' }}
          region={{
            latitude,
            longitude,
            latitudeDelta: 0,
            longitudeDelta: 0,
          }}
        />
      </Box>
    </Box>
  );
};

export default FullScreenMapView;
