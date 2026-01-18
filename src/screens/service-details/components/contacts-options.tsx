import { Box, useAppTheme } from 'common';
import { AppButton, AppPresseble, AppSpacer, AppText, BaseModal, Lock, Mail } from 'components';
import { useChatController } from 'hooks';
import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from 'store';
import { IContactOptions, IModalRef } from 'types';

const ContactOptions: FC<IContactOptions> = ({ vendor, serviceId }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { startChatWithVendor, isStartChatLaoding } = useChatController();
  const { user, isGuestMode, setIsGuestMode } = useAuthStore();
  const loginModalRef = useRef<IModalRef>(null);

  if (vendor?.id === user?.id) return null;

  const handleMessagePress = () => {
    if (isGuestMode) {
      loginModalRef.current?.openModal();
    } else {
      startChatWithVendor({
        vendor,
        serviceId,
      });
    }
  };

  const handleLoginPress = () => {
    loginModalRef.current?.closeModal();
    setIsGuestMode(false);
  };

  return (
    <>
      <Box
        position="absolute"
        bottom={10}
        width={'95%'}
        alignSelf="center"
        flexDirection="row"
        alignItems="center"
        backgroundColor="white"
      >
        <AppPresseble
          style={{ flex: 1 }}
          isLoading={isStartChatLaoding && !isGuestMode}
          onPress={handleMessagePress}
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
      </Box>

      <BaseModal ref={loginModalRef}>
        <Box padding="m" alignItems="center">
          <Box marginBottom="l">
            <Lock size={64} color="#464F67" />
          </Box>
          <AppText variant="h6" color="lightBlack" textAlign="center" marginBottom="m">
            {t('loginRequired')}
          </AppText>
          <AppText variant="s1" color="customGray" textAlign="center" marginBottom="xl">
            {t('pleaseLoginToMessageVendor')}
          </AppText>
          <AppButton
            label={t('loginNow')}
            onPress={handleLoginPress}
            isFullWidth
          />
          <AppSpacer variant="s" />
          <AppButton
            label={t('cancel')}
            onPress={() => loginModalRef.current?.closeModal()}
            isFullWidth
            isOutLined
          />
        </Box>
      </BaseModal>
    </>
  );
};

export default ContactOptions;
