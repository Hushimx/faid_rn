import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { Box, useAppTheme } from 'common';
import {
  AppHeader,
  AppPresseble,
  AppSpaceWrapper,
  AppSpacer,
  AppText,
  Plus,
} from 'components';
import { useTicketDetailController } from 'hooks';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList, IModalRef } from 'types';
import { ITicketMessage } from 'types';
import { useAuthStore } from 'store';
import { createdAtHelper } from 'utils';
import { useState, useRef } from 'react';
import TicketActionsModal from './components/ticket-actions-modal';
import Video from 'react-native-video';

const TicketDetail = (
  props: NativeStackScreenProps<RootStackParamList, 'TicketDetail'>,
) => {
  const { t } = useTranslation();
  const { ticketId } = props.route.params;
  const { user } = useAuthStore();
  const { colors } = useAppTheme();
  const [messageText, setMessageText] = useState('');
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const actionsModalRef = useRef<IModalRef>(null);

  const {
    ticket,
    messages,
    isTicketLoading,
    isMessagesLoading,
    sendMessage,
    isSending,
    toggleTicketStatus,
    isUpdating,
    pickMedia,
    previewMedia,
    confirmSendMedia,
    cancelPreview,
    isMediaLoading,
    refetchMessages,
  } = useTicketDetailController(ticketId);

  const handleSendMessage = async () => {
    if (previewMedia) {
      // Send with media
      await confirmSendMedia(messageText);
      setMessageText('');
    } else {
      // Send text only
      if (!messageText.trim()) return;
      if (ticket?.status === 'closed') {
        return;
      }
      const messageToSend = messageText.trim();
      setMessageText(''); // Clear input immediately for better UX
      await sendMessage({ message: messageToSend });
    }
  };

  const renderMessage = ({ item }: { item: ITicketMessage }) => {
    const isMyMessage = item.user?.id === user?.id;
    // Always prefer created_at_human from API (server-calculated, accurate)
    // Only use createdAtHelper as fallback if created_at_human is missing
    const timeAgo = item.created_at_human 
      ? item.created_at_human 
      : (item.created_at ? createdAtHelper(item.created_at) : t('justNow'));

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
      >
        {/* Sender Name - Always Show for Better Clarity */}
        <View style={styles.messageHeader}>
          <AppText 
            variant="s3" 
            color={isMyMessage ? 'primary' : 'customGray'} 
            fontWeight="600"
          >
            {isMyMessage ? t('you') : (item.user?.name || t('admin'))}
          </AppText>
        </View>

        {/* Message Bubble */}
        <Box
          backgroundColor={isMyMessage ? 'primary' : 'white'}
          borderRadius={16}
          padding="m"
          style={[
            styles.messageBubble,
            {
              borderTopLeftRadius: isMyMessage ? 16 : 4,
              borderTopRightRadius: isMyMessage ? 4 : 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            },
          ]}
        >
          {/* Message Text */}
          {item.message && (
            <AppText
              color={isMyMessage ? 'white' : 'cutomBlack'}
              variant="s2"
              style={[
                styles.messageText,
                { marginBottom: item.attachment ? 8 : 0 },
              ]}
            >
              {item.message}
            </AppText>
          )}

          {/* Attachment */}
          {item.attachment && (
            <Pressable
              onPress={() => setViewingImage(item.attachment || null)}
              style={styles.attachmentContainer}
            >
              <Image
                source={{ uri: item.attachment }}
                style={styles.attachmentImage}
                resizeMode="cover"
              />
            </Pressable>
          )}

          {/* Timestamp */}
          <AppText
            color={isMyMessage ? 'white' : 'customGray'}
            variant="s3"
            marginTop="ss"
            style={{ 
              opacity: 0.85,
              fontSize: 11,
            }}
          >
            {timeAgo}
          </AppText>
        </Box>
      </View>
    );
  };

  if (isTicketLoading) {
    return (
      <Box flex={1} backgroundColor="pageBackground" alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={colors.primary} />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box flex={1} backgroundColor="pageBackground" alignItems="center" justifyContent="center">
        <AppText variant="s1" color="customGray">
          {t('ticketNotFound')}
        </AppText>
      </Box>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.pageBackground }}>
      <AppHeader
        label={ticket.subject}
        rightComponent={
          <AppPresseble
            onPress={toggleTicketStatus}
            isLoading={isUpdating}
            disabled={isUpdating}
          >
            <AppText
              color={ticket.status === 'open' ? 'danger' : 'primary'}
              variant="s2"
              fontWeight="700"
            >
              {ticket.status === 'open' ? t('closeTicket') : t('reopenTicket')}
            </AppText>
          </AppPresseble>
        }
      />

      <AppSpaceWrapper>
        {/* Ticket Info - Redesigned with better hierarchy */}
        <Box
          backgroundColor="white"
          borderRadius={12}
          padding="m"
          marginTop="s"
          marginBottom="s"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          {/* Subject and Status in Same Row */}
          <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start" marginBottom="s">
            <Box flex={1} marginRight="s">
              <AppText 
                variant="s2" 
                color="customGray" 
                marginBottom="ss"
                fontWeight="600"
              >
                {t('ticketSubject')}
              </AppText>
              <AppText 
                variant="h3" 
                fontWeight="700" 
                color="cutomBlack"
                style={{ fontSize: 20 }}
              >
                {ticket.subject}
              </AppText>
            </Box>
            {/* Status Badge */}
            <Box
              style={{
                backgroundColor:
                  ticket.status === 'open' ? colors.primary : colors.customGray,
              }}
              borderRadius={8}
              paddingHorizontal="m"
              paddingVertical="s"
              alignSelf="flex-start"
            >
              <AppText color="white" variant="s3" fontWeight="700">
                {t(ticket.status)}
              </AppText>
            </Box>
          </Box>
          
          {/* Visual Separator */}
          <Box 
            height={1} 
            backgroundColor="grayLight" 
            marginBottom="s" 
            marginVertical="s"
          />

          {/* Description */}
          <AppText 
            variant="s2" 
            color="customGray" 
            marginBottom="ss"
            fontWeight="600"
          >
            {t('ticketDescription')}
          </AppText>
          <AppText 
            variant="s2" 
            color="customGray" 
            marginBottom="m"
            style={{ lineHeight: 22 }}
          >
            {ticket.description}
          </AppText>
          
          {/* Timestamp with Label */}
          <Box marginTop="s" paddingTop="s" borderTopWidth={1} borderTopColor="grayLight">
            <AppText 
              variant="s2" 
              color="customGray" 
              marginBottom="ss"
              fontWeight="600"
            >
              {t('ticketCreatedAt')}
            </AppText>
            <AppText variant="s3" color="customGray" fontWeight="500">
              {ticket.created_at_human || createdAtHelper(ticket.created_at)}
            </AppText>
          </Box>
        </Box>

        {/* Messages List - Inverted to start from bottom */}
        <BottomTabBarHeightContext.Consumer>
          {tabBarHeight => (
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={item => item.id.toString()}
              inverted={true}
              contentContainerStyle={[
                styles.messagesList,
                { paddingTop: (tabBarHeight || 0) + 80 },
              ]}
              ListEmptyComponent={
                !isMessagesLoading ? (
                  <Box alignItems="center" justifyContent="center" padding="m">
                    <AppText variant="s2" color="customGray">
                      {t('noMessages')}
                    </AppText>
                  </Box>
                ) : null
              }
              refreshing={isMessagesLoading}
              onRefresh={async () => {
                // Manual refresh
                await refetchMessages();
              }}
            />
          )}
        </BottomTabBarHeightContext.Consumer>
      </AppSpaceWrapper>

      {/* Message Input */}
      {ticket.status === 'open' && (
        <BottomTabBarHeightContext.Consumer>
          {tabBarHeight => (
            <Box
              backgroundColor="white"
              padding="s"
              style={[
                styles.inputContainer,
                { paddingBottom: (tabBarHeight || 0) + 8 },
              ]}
            >
              {/* Media Preview */}
              {previewMedia && (
                <Box
                  marginBottom="s"
                  borderRadius={12}
                  overflow="hidden"
                  position="relative"
                >
                  <Pressable onPress={cancelPreview}>
                    <Box
                      position="absolute"
                      top={8}
                      right={8}
                      zIndex={10}
                      borderRadius={20}
                      width={32}
                      height={32}
                      alignItems="center"
                      justifyContent="center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                    >
                      <AppText color="white" variant="s3" fontWeight="700">
                        ×
                      </AppText>
                    </Box>
                  </Pressable>
                  {previewMedia.type === 'image' ? (
                    <Image
                      source={{ uri: previewMedia.uri }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Video
                      source={{ uri: previewMedia.uri }}
                      style={styles.previewVideo}
                      resizeMode="cover"
                      paused={false}
                      repeat
                    />
                  )}
                </Box>
              )}

              <Box flexDirection="row" alignItems="center">
                {/* Actions Button */}
                <TouchableOpacity
                  onPress={() => actionsModalRef.current?.openModal()}
                  disabled={isMediaLoading}
                  style={styles.actionsButton}
                >
                  {isMediaLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Plus size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>

                {/* Message Input */}
                <Box flex={1} marginRight="s" marginLeft="s">
                  <TextInput
                    placeholder={t('typeMessage')}
                    placeholderTextColor={colors.customGray}
                    value={messageText}
                    onChangeText={setMessageText}
                    multiline
                    maxLength={5000}
                    style={[
                      styles.messageInput,
                      {
                        backgroundColor: colors.white,
                        borderColor: colors.grayLight,
                        color: colors.cutomBlack,
                      },
                    ]}
                  />
                </Box>

                {/* Send Button */}
                <TouchableOpacity
                  onPress={handleSendMessage}
                  disabled={(!messageText.trim() && !previewMedia) || isSending}
                  style={[
                    styles.sendButton,
                    ((!messageText.trim() && !previewMedia) || isSending) && styles.sendButtonDisabled,
                  ]}
                >
                  {isSending ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <AppText color="white" variant="s2" fontWeight="700">
                      {t('send')}
                    </AppText>
                  )}
                </TouchableOpacity>
              </Box>
            </Box>
          )}
        </BottomTabBarHeightContext.Consumer>
      )}

      {/* Ticket Actions Modal */}
      <TicketActionsModal
        ref={actionsModalRef}
        onSelectMedia={pickMedia}
      />

      {/* Image Viewer Modal */}
      <Modal
        visible={!!viewingImage}
        transparent
        animationType="fade"
        onRequestClose={() => setViewingImage(null)}
      >
        <Pressable
          style={styles.imageModalOverlay}
          onPress={() => setViewingImage(null)}
        >
          <Image
            source={{ uri: viewingImage || '' }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  messageBubble: {
    maxWidth: '85%',
    minWidth: 100,
  },
  messageText: {
    lineHeight: 22,
    fontSize: 15,
  },
  attachmentContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  attachmentImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  messagesList: {
    flexGrow: 1,
    paddingTop: 12,
    paddingBottom: 8,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  messageInput: {
    maxHeight: 100,
    minHeight: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
    height: 44,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  actionsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  previewVideo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});

export default TicketDetail;

