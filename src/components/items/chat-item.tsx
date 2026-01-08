import { Box } from 'common';
import { AppImage, AppPresseble, AppText } from 'components/atoms';
import { FC, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { IChat } from 'types';
import { createdAtHelper } from 'utils';
import { useAuthStore } from 'store';
import i18n from 'i18n';

interface IChatItemProps {
  index: number;
  onPress: () => void;
  chat: IChat;
}

const ChatItem: FC<IChatItemProps> = ({ index, onPress, chat }) => {
  const { user } = useAuthStore();
  
  // Helper to extract string from translation object
  const getTranslatedValue = (value: string | { ar: string; en: string } | null | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const currentLang = i18n.language || 'ar';
    return value[currentLang as 'ar' | 'en'] || value.ar || value.en || '';
  };
  
  // Determine which user to display based on current user type
  const otherUser = user?.type === 'vendor' ? chat.user : chat.vendor;
  const lastMessage = chat.lastMessage;
  const serviceTitleRaw = chat.service?.title;
  const serviceTitle = useMemo(() => getTranslatedValue(serviceTitleRaw as any), [serviceTitleRaw]);

  // Format last message preview
  const getMessagePreview = () => {
    if (!lastMessage) return '';
    
    if (lastMessage.file_path) {
      if (lastMessage.file_type?.startsWith('image/')) {
        return '📷 Image';
      } else if (lastMessage.file_type?.startsWith('video/')) {
        return '🎥 Video';
      }
      return '📎 File';
    }
    
    return lastMessage.message || '';
  };

  const messagePreview = getMessagePreview();
  const timeAgo = lastMessage 
    ? createdAtHelper(lastMessage.created_at)
    : createdAtHelper(chat.updated_at);

  return (
    <Animated.View entering={FadeIn.delay(index * 50)}>
      <AppPresseble onPress={onPress}>
        <Box
          backgroundColor="white"
          borderRadius={10}
          padding="m"
          marginBottom="s"
          flexDirection="row"
          alignItems="center"
        >
          {/* Avatar */}
          <Box
            width={50}
            height={50}
            borderRadius={25}
            overflow="hidden"
            marginRight="m"
            backgroundColor="grayLight"
          >
            <AppImage
              source={{ uri: otherUser?.profile_picture || '' }}
              style={styles.avatar}
            />
          </Box>

          <Box flex={1}>
            {/* Name and Time */}
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="ss"
            >
              <AppText
                color="cutomBlack"
                variant="s1"
                fontWeight="700"
                numberOfLines={1}
              >
                {otherUser?.name || 'Unknown'}
              </AppText>
              <AppText color="customGray" variant="s3">
                {timeAgo}
              </AppText>
            </Box>

            {/* Service Title */}
            {serviceTitle && (
              <AppText
                color="customGray"
                variant="s2"
                marginBottom="ss"
                numberOfLines={1}
              >
                {serviceTitle}
              </AppText>
            )}

            {/* Last Message Preview */}
            {messagePreview && (
              <AppText
                color="customGray"
                variant="s2"
                numberOfLines={1}
              >
                {messagePreview}
              </AppText>
            )}
          </Box>
        </Box>
      </AppPresseble>
    </Animated.View>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  avatar: {
    width: '100%',
    height: '100%',
  },
});





