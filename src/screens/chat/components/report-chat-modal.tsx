import { BaseModal } from 'components/modals';
import { AppButton, AppSpacer, AppSpaceWrapper, AppText, AppTextArea } from 'components/atoms';
import { Box } from 'common';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IModalRef } from 'types';

interface IReportChatModalProps {
  onReport: (reason: string) => void;
  isLoading?: boolean;
}

const ReportChatModal = (
  props: IReportChatModalProps,
  ref: React.Ref<IModalRef>,
) => {
  const { onReport, isLoading = false } = props;
  const { t } = useTranslation();
  const [reason, setReason] = useState('');

  const handleReport = () => {
    if (reason.trim().length >= 10) {
      onReport(reason.trim());
      setReason('');
      ref?.current?.closeModal();
    }
  };

  const closeModal = () => {
    setReason('');
    ref?.current?.closeModal();
  };

  return (
    <BaseModal ref={ref}>
      <AppSpaceWrapper>
        <AppSpacer variant="m" />
        <AppText variant="h5" fontWeight="700" marginBottom="m">
          {t('reportChat') || 'Report Chat'}
        </AppText>
        <AppText variant="s2" color="grayDark" marginBottom="l">
          {t('reportChatDescription') || 'Please provide a reason for reporting this chat. Your report will be reviewed by our team.'}
        </AppText>
        <AppTextArea
          placeholder={t('enterReportReason') || 'Enter reason (minimum 10 characters)'}
          value={reason}
          onChangeText={setReason}
          numberOfLines={5}
        />
        <AppSpacer variant="m" />
        <Box flexDirection="row" justifyContent="space-between">
          <Box flex={1} marginRight="s">
            <AppButton
              label={t('cancel')}
              isOutLined
              onPress={closeModal}
              disabled={isLoading}
            />
          </Box>
          <Box flex={1} marginLeft="s">
            <AppButton
              label={t('report') || 'Report'}
              onPress={handleReport}
              isLoading={isLoading}
              disabled={reason.trim().length < 10}
            />
          </Box>
        </Box>
        <AppSpacer variant="m" />
      </AppSpaceWrapper>
    </BaseModal>
  );
};

export default forwardRef(ReportChatModal);

