import { Box } from 'common';
import {
  AppPresseble,
  AppText,
  ChevronSmall,
  CitiesModal,
  LocationPin,
} from 'components';
import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ICityResponse, IModalRef } from 'types';

interface IProps {
  selectedCity: ICityResponse | null;
  onSelectCity: (city: ICityResponse | null) => void;
}

const CitySelectionSection: FC<IProps> = ({ selectedCity, onSelectCity }) => {
  const { t } = useTranslation();
  const citiesModalRef = useRef<IModalRef>(null);

  return (
    <>
      <AppPresseble onPress={() => citiesModalRef?.current?.openModal()}>
        <Box alignItems="center" flexDirection="row">
          <Box marginRight="ss">
            <LocationPin />
          </Box>
          <AppText
            fontWeight={'700'}
            children={selectedCity ? selectedCity?.name : t('noCitySelected')}
          />
          <ChevronSmall />
        </Box>
      </AppPresseble>
      <CitiesModal
        ref={citiesModalRef}
        onSelectCity={onSelectCity}
        selectedCity={selectedCity}
      />
    </>
  );
};

export default CitySelectionSection;
