import { Box } from 'common';
import { AppPresseble, AppText } from 'components/atoms';
import { FC } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { INotification } from 'types';
import { createdAtHelper } from 'utils';

interface INotificationItemProps {
  index: number;
  onPress: () => void;
  title: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}

const NotificationItem: FC<INotificationItemProps> = ({
  index,
  onPress,
  title,
  body,
  readAt,
  createdAt,
}) => {
  const isRead = !!readAt;
  const timeAgo = createdAtHelper(createdAt);

  return (
    <Animated.View entering={FadeIn.delay(index * 50)}>
      <AppPresseble onPress={onPress}>
        <Box
          backgroundColor={isRead ? 'white' : 'lightBlue'}
          borderRadius={10}
          padding="m"
          marginBottom="s"
          flexDirection="row"
          alignItems="center"
        >
          {/* Unread indicator dot */}
          {!isRead && (
            <Box
              width={10}
              height={10}
              borderRadius={5}
              backgroundColor="primary"
              marginRight="s"
            />
          )}

          <Box flex={1}>
            <AppText
              color="cutomBlack"
              variant="s1"
              fontWeight={isRead ? '400' : '700'}
              marginBottom="ss"
            >
              {title}
            </AppText>

            <AppText
              color="customGray"
              variant="s2"
              numberOfLines={2}
              marginBottom="ss"
            >
              {body}
            </AppText>

            <AppText color="customGray" variant="s3">
              {timeAgo}
            </AppText>
          </Box>
        </Box>
      </AppPresseble>
    </Animated.View>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({});
