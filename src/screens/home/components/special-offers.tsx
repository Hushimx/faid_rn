import { Box } from 'common';
import { AppSlider } from 'components';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IOffers } from 'types';
import ServiceSectionTilte from '../../../components/sections/service-section-title';
interface IProps {
  offers: IOffers[];
}

const SpecialOffers: FC<IProps> = ({ offers }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <ServiceSectionTilte title={t('specialOffers')} />
      <AppSlider
        data={offers}
        showMediaCount={false}
        getUrl={item => item.image}
      />
    </Box>
  );
};
export default SpecialOffers;
