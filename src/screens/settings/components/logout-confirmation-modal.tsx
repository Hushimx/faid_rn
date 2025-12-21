import { Box, useAppTheme } from 'common';
import {
  AppButton,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  BaseModal,
} from 'components';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  onConfirm: () => void;
}

const LogoutConfirmationModal = (props: IProps, ref: any) => {
  const { onConfirm } = props;
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  const closeModal = () => {
    ref?.current?.closeModal();
  };

  const handleConfirm = () => {
    closeModal();
    onConfirm();
  };

  return (
    <BaseModal ref={ref}>
      <AppSpaceWrapper>
        <AppText variant="h6" textAlign="center">
          {t('logoutConfirmationTitle')}
        </AppText>
        <AppSpacer />
        <AppText variant="s1" textAlign="center" color="grayDark">
          {t('logoutConfirmationMessage')}
        </AppText>
        <AppSpacer variant="l" />
        <Box flexDirection="row" justifyContent="space-between">
          <Box flex={1}>
            <AppButton
              label={t('cancel')}
              onPress={closeModal}
              isOutLined
              style={{ borderColor: colors.grayLight }}
              textColor="lightBlack"
            />
          </Box>
          <AppSpacer variant="s" />
          <Box flex={1}>
            <AppButton
              label={t('logout')}
              onPress={handleConfirm}
              style={{ backgroundColor: colors.red, borderColor: colors.red }}
              textColor="white"
            />
          </Box>
        </Box>
      </AppSpaceWrapper>
    </BaseModal>
  );
};

export default forwardRef(LogoutConfirmationModal);
