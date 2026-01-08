import { Box } from 'common';
import { AppPresseble, AppSpacer, AppText, UserAvatar } from 'components';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IServiceProviderInfo } from 'types';

const ServiceProviderInfo: FC<IServiceProviderInfo> = ({
  serviceProviderName,
  serviceProviderImage,
  onPress,
}) => {
  const { t } = useTranslation();
  return (
    <Box>
      <AppText fontWeight={'700'} color="cutomBlack">
        {t('aboutServiceProvider')}
      </AppText>
      <AppSpacer variant="ss" />
      <AppPresseble onPress={onPress} disabled={!onPress}>
        <Box
          flexDirection="row"
          alignItems="center"
          borderRadius={10}
          padding="s"
          backgroundColor="grayLight"
        >
          <UserAvatar image={serviceProviderImage} />
          <Box marginLeft="s">
            <AppText>{serviceProviderName}</AppText>
            <AppText color="customGray">{t('serviceProvider')}</AppText>
          </Box>
        </Box>
      </AppPresseble>
    </Box>
  );
};

export default ServiceProviderInfo;
