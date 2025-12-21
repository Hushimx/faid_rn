import { Box, useAppTheme } from 'common';
import { AppPresseble, AppText, Mail } from 'components';
import { useChatController } from 'hooks';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from 'store';
import { IContactOptions } from 'types';

const ContactOptions: FC<IContactOptions> = ({ vendor, serviceId }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { startChatWithVendor, isStartChatLaoding } = useChatController();
  const { user } = useAuthStore();
  if (vendor?.id === user?.id) return null;
  return (
    <Box
      position="absolute"
      bottom={10}
      width={'95%'}
      alignSelf="center"
      flexDirection="row"
      // backgroundColor="red"
      alignItems="center"
      backgroundColor="white"
      // justifyContent="space-evenly"
    >
      {/* <AppPresseble>
        <Box
          borderRadius={8}
          alignItems="center"
          backgroundColor="purple"
          justifyContent="center"
          paddingHorizontal="l"
          paddingVertical="s"
          flexDirection="row"
        >
          <AppImage source={IMAGES.whatsapp} />

          <AppText  color="primary" marginLeft="s">
            {t('conversation')}
          </AppText>
        </Box>
      </AppPresseble> */}
      <AppPresseble
        style={{ flex: 1 }}
        isLoading={isStartChatLaoding}
        onPress={() =>
          startChatWithVendor({
            vendor,
            serviceId,
          })
        }
      >
        <Box
          borderRadius={8}
          alignItems="center"
          backgroundColor="purple"
          justifyContent="center"
          padding="sm"
          flexDirection="row"
          width={'100%'}
        >
          <Mail color={colors.primary} />
          <AppText color="primary" variant="s1" marginLeft="s">
            {t('message')}
          </AppText>
        </Box>
      </AppPresseble>
      {/* <AppPresseble>
        <Box
          borderRadius={8}
          alignItems="center"
          backgroundColor="purple"
          justifyContent="center"
          paddingHorizontal="l"
          paddingVertical="s"
          flexDirection="row"
        >
          <RoundedPhone />
          <AppText color="primary" marginLeft="s">
            {t('call')}
          </AppText>
        </Box>
      </AppPresseble> */}
    </Box>
  );
};

export default ContactOptions;
