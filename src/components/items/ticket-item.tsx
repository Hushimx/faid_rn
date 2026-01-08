import { FC } from 'react';
import { Box } from 'common';
import { AppPresseble, AppText } from 'components';
import { ITicket, TicketPriority, TicketStatus } from 'types';
import { createdAtHelper } from 'utils';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAppTheme } from 'common';
import { useTranslation } from 'react-i18next';

interface ITicketItemProps {
  ticket: ITicket;
  index: number;
  onPress: () => void;
}

const TicketItem: FC<ITicketItemProps> = ({ ticket, index, onPress }) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const timeAgo = ticket.created_at_human || createdAtHelper(ticket.created_at);

  const getPriorityColor = (priority: TicketPriority): string => {
    // Return direct color values for use in style prop
    switch (priority) {
      case 'high':
        return colors.danger || '#FF3B30';
      case 'medium':
        return colors.warning || '#FF9500';
      case 'low':
        return colors.success || '#34C759';
      default:
        return colors.customGray;
    }
  };

  const getStatusColor = (status: TicketStatus): string => {
    // Return direct color values for use in style prop
    return status === 'open' ? colors.primary : colors.customGray;
  };

  const getStatusText = (status: TicketStatus) => {
    return status === 'open' ? 'Open' : 'Closed';
  };

  return (
    <Animated.View entering={FadeIn.delay(index * 50)}>
      <AppPresseble onPress={onPress}>
        <Box
          backgroundColor="white"
          borderRadius={10}
          padding="m"
          marginBottom="s"
        >
          {/* Header: Subject and Status */}
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-start"
            marginBottom="s"
          >
            <Box flex={1} marginRight="s">
              <AppText
                color="customGray"
                variant="s3"
                fontWeight="600"
                marginBottom="ss"
              >
                {t('ticketSubject')}
              </AppText>
              <AppText
                color="cutomBlack"
                variant="s1"
                fontWeight="700"
                numberOfLines={2}
              >
                {ticket.subject}
              </AppText>
            </Box>
            <Box alignItems="flex-end">
              <AppText
                color="customGray"
                variant="s3"
                fontWeight="600"
                marginBottom="ss"
              >
                {t('ticketStatus')}
              </AppText>
              <Box
                style={{ backgroundColor: getStatusColor(ticket.status) }}
                borderRadius={12}
                paddingHorizontal="s"
                paddingVertical="ss"
              >
                <AppText color="white" variant="s3" fontWeight="600">
                  {getStatusText(ticket.status)}
                </AppText>
              </Box>
            </Box>
          </Box>

          {/* Description */}
          <Box marginBottom="s">
            <AppText
              color="customGray"
              variant="s3"
              fontWeight="600"
              marginBottom="ss"
            >
              {t('ticketDescription')}
            </AppText>
            <AppText
              color="customGray"
              variant="s2"
              numberOfLines={2}
            >
              {ticket.description}
            </AppText>
          </Box>

          {/* Footer: Priority, Messages Count, and Time */}
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-start"
            paddingTop="s"
            borderTopWidth={1}
            borderTopColor="grayLight"
          >
            <Box flex={1}>
              {/* Priority Badge */}
              {ticket.priority && (
                <Box marginBottom="ss">
                  <AppText
                    color="customGray"
                    variant="s3"
                    fontWeight="600"
                    marginBottom="ss"
                  >
                    {t('ticketPriority')}
                  </AppText>
                  <Box
                    style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                    borderRadius={8}
                    paddingHorizontal="s"
                    paddingVertical="ss"
                    alignSelf="flex-start"
                  >
                    <AppText color="white" variant="s3" fontWeight="600">
                      {ticket.priority.toUpperCase()}
                    </AppText>
                  </Box>
                </Box>
              )}

              {/* Messages Count */}
              {ticket.messages_count !== undefined && (
                <Box marginTop="ss">
                  <AppText
                    color="customGray"
                    variant="s3"
                    fontWeight="600"
                    marginBottom="ss"
                  >
                    {t('ticketMessagesCount')}
                  </AppText>
                  <AppText color="customGray" variant="s3">
                    {ticket.messages_count} {ticket.messages_count === 1 ? t('message') : t('messages')}
                  </AppText>
                </Box>
              )}
            </Box>

            <Box alignItems="flex-end">
              <AppText
                color="customGray"
                variant="s3"
                fontWeight="600"
                marginBottom="ss"
              >
                {t('ticketCreatedAt')}
              </AppText>
              <AppText color="customGray" variant="s3">
                {timeAgo}
              </AppText>
            </Box>
          </Box>
        </Box>
      </AppPresseble>
    </Animated.View>
  );
};

export default TicketItem;

