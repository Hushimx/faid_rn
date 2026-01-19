import { Box } from 'common';
import { AppHeader, AppSpaceWrapper, AppSpacer } from 'components';
import { useTranslation } from 'react-i18next';

const ServiceAddons = () => {
  const { t } = useTranslation();

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppHeader label={t('serviceAddons') || 'Service Addons'} />
      <AppSpaceWrapper>
        <AppSpacer variant="m" />
        {/* Add your service addons content here */}
      </AppSpaceWrapper>
    </Box>
  );
};

export default ServiceAddons;
