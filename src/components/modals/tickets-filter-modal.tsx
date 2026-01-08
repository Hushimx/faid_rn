import { Box } from 'common';
import { BaseModal, ModalHeader } from 'components';
import {
  AppFilterBtn,
  AppPresseble,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
} from 'components/atoms';
import { forwardRef, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { TicketStatus, TicketPriority } from 'types';

interface IProps {
  onSelectStatus: (status: TicketStatus | null) => void;
  onSelectPriority: (priority: TicketPriority | null) => void;
  selectedStatus: TicketStatus | null;
  selectedPriority: TicketPriority | null;
}

const TicketsFilterModal = (props: IProps, ref: any) => {
  const { onSelectStatus, onSelectPriority, selectedStatus, selectedPriority } = props;
  const { t } = useTranslation();

  const closeModal = () => {
    ref?.current?.closeModal();
  };

  const handleSelectStatus = (status: TicketStatus | null) => {
    onSelectStatus(status);
  };

  const handleSelectPriority = (priority: TicketPriority | null) => {
    onSelectPriority(priority);
  };

  const onOpenModal = () => {
    ref?.current?.openModal();
  };

  const getFilterLabel = () => {
    const parts: string[] = [];
    if (selectedStatus) parts.push(t(selectedStatus));
    if (selectedPriority) parts.push(t(selectedPriority));
    return parts.length > 0 ? parts.join(', ') : t('filters');
  };

  const hasActiveFilters = !!selectedStatus || !!selectedPriority;

  const handleReset = () => {
    onSelectStatus(null);
    onSelectPriority(null);
  };

  const statusOptions: TicketStatus[] = ['open', 'closed'];
  const priorityOptions: TicketPriority[] = ['low', 'medium', 'high'];

  return (
    <Fragment>
      <AppFilterBtn
        label={getFilterLabel()}
        onPress={onOpenModal}
        isActive={hasActiveFilters}
        marginLeft
      />
      <BaseModal ref={ref}>
        <BaseModal.KeyboardRestoreHandler modalRef={ref}>
          <AppSpaceWrapper>
            <ModalHeader
              title={t('filters')}
              onReset={hasActiveFilters ? handleReset : undefined}
            />
            <AppSpacer />

            {/* Status Filter Section */}
            <Box marginBottom="m">
              <AppText variant="s1" color="grayDark" marginBottom="s" fontWeight="600">
                {t('status')}
              </AppText>
              <Box flexDirection="row" flexWrap="wrap">
                {statusOptions.map(status => {
                  const isSelected = status === selectedStatus;
                  return (
                    <AppPresseble
                      key={status}
                      onPress={() => handleSelectStatus(isSelected ? null : status)}
                    >
                      <Box
                        borderRadius={12}
                        borderWidth={1}
                        borderColor={isSelected ? 'primary' : 'grayLight'}
                        paddingHorizontal="m"
                        paddingVertical="s"
                        backgroundColor={isSelected ? 'primary' : 'white'}
                        marginRight="s"
                        marginBottom="s"
                      >
                        <AppText
                          variant="s2"
                          color={isSelected ? 'white' : 'cutomBlack'}
                          fontWeight={isSelected ? '600' : '400'}
                        >
                          {t(status)}
                        </AppText>
                      </Box>
                    </AppPresseble>
                  );
                })}
              </Box>
            </Box>

            {/* Priority Filter Section */}
            <Box marginBottom="m">
              <AppText variant="s1" color="grayDark" marginBottom="s" fontWeight="600">
                {t('priority')}
              </AppText>
              <Box flexDirection="row" flexWrap="wrap">
                {priorityOptions.map(priority => {
                  const isSelected = priority === selectedPriority;
                  return (
                    <AppPresseble
                      key={priority}
                      onPress={() => handleSelectPriority(isSelected ? null : priority)}
                    >
                      <Box
                        borderRadius={12}
                        borderWidth={1}
                        borderColor={isSelected ? 'primary' : 'grayLight'}
                        paddingHorizontal="m"
                        paddingVertical="s"
                        backgroundColor={isSelected ? 'primary' : 'white'}
                        marginRight="s"
                        marginBottom="s"
                      >
                        <AppText
                          variant="s2"
                          color={isSelected ? 'white' : 'cutomBlack'}
                          fontWeight={isSelected ? '600' : '400'}
                        >
                          {t(priority)}
                        </AppText>
                      </Box>
                    </AppPresseble>
                  );
                })}
              </Box>
            </Box>

            <AppSpacer variant="ml" />
          </AppSpaceWrapper>
        </BaseModal.KeyboardRestoreHandler>
      </BaseModal>
    </Fragment>
  );
};

export default forwardRef(TicketsFilterModal);


