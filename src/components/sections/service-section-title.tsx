import { Box } from 'common';
import { AppText } from 'components';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  title: string;
  onShowAllPress?: () => void;
}

const ServiceSectionTilte: FC<IProps> = ({ title, onShowAllPress }) => {
  const { t } = useTranslation();
  return (
    <Box flexDirection="row" alignItems="center" justifyContent="space-between">
      <AppText variant="h6">{title}</AppText>
      {onShowAllPress && (
        <AppText
          color="primary"
          textDecorationLine="underline"
          textDecorationColor="primary"
          onPress={onShowAllPress}
        >
          {t('viewAll')}
        </AppText>
      )}
    </Box>
  );
};

export default ServiceSectionTilte;
