import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Spinner } from '@ui-kitten/components';
import { Box, useAppTheme } from 'common';
import { AppHeader, AppText } from 'components';
import { Plus } from 'components/icons';
import { useChatController } from 'hooks';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Actions,
  GiftedChat,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import Video from 'react-native-video';
import { useAuthStore } from 'store';
import { RootStackParamList } from 'types';

const Chat = (props: NativeStackScreenProps<RootStackParamList, 'Chat'>) => {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const { vendor, chatId } = props?.route?.params;
  const {
    isMessagesLoading,
    sendMessage,
    messagesList,
    setMessagesList,
    pickMedia,
    isMediaLoaading,
    previewMedia,
    confirmSendMedia,
    cancelPreview,
  } = useChatController({
    chatId,
  });
  const { user } = useAuthStore();
  const { colors } = useAppTheme();

  const onSend = useCallback(
    (messages = [] as any) => {
      const message = messages?.[0]?.text;

      if (previewMedia) {
        // Send with media
        confirmSendMedia(message);
      } else {
        // Send text only
        sendMessage({
          message,
        });
        setMessagesList(previousMessages =>
          GiftedChat.append(previousMessages, messages),
        );
      }
    },
    [previewMedia],
  );

  const renderActions = useCallback(
    (props: any) => (
      <Actions
        // {...props}
        onPressActionButton={pickMedia}
        icon={() => (
          <Box width={'100%'} marginTop="ss">
            {isMediaLoaading ? (
              <Spinner status="primary" />
            ) : (
              <Plus size={24} color={colors.primary} />
            )}
          </Box>
        )}
      />
    ),
    [isMediaLoaading],
  );

  const renderSend = useCallback(
    (props: any) => {
      const { text, onSend } = props;
      if ((text && text.trim().length > 0) || previewMedia) {
        return (
          <TouchableOpacity
            onPress={() => {
              if (onSend) {
                onSend({ text: text || '' }, true);
              }
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginRight: 10,
              marginBottom: 10,
            }}
          >
            <AppText variant="s1" color="primary" fontWeight="700">
              {t('send')}
            </AppText>
          </TouchableOpacity>
        );
      }
      return <Send {...props} disabled />;
    },
    [previewMedia],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.pageBackground }}>
      <AppHeader label={vendor?.name} isChatHeader />
      <BottomTabBarHeightContext.Consumer>
        {tabBarHeight => {
          return (
            <GiftedChat
              renderAvatar={null}
              bottomOffset={-(tabBarHeight ?? 0)}
              messages={messagesList}
              onSend={messages => onSend(messages as any)}
              user={{
                _id: user?.id!,
              }}
              renderSend={renderSend}
              renderActions={renderActions}
              renderChatEmpty={() => (
                <Box
                  flex={1}
                  alignItems="center"
                  justifyContent="center"
                  style={{ transform: [{ scaleY: -1 }] }}
                >
                  <AppText variant="s1">{t('noData')}</AppText>
                </Box>
              )}
              lightboxProps={{
                activeProps: {
                  style: {
                    flex: 1,
                    resizeMode: 'contain',
                    width,
                  },
                },
              }}
              renderMessageVideo={props => (
                <Box
                  height={200}
                  width={250}
                  borderRadius={10}
                  overflow="hidden"
                  backgroundColor="cutomBlack"
                >
                  <Video
                    source={{ uri: props.currentMessage?.video }}
                    style={{ flex: 1 }}
                    resizeMode="cover"
                    controls
                    paused
                  />
                </Box>
              )}
              textInputProps={{
                paddingLeft: 10,
              }}
              renderInputToolbar={props => (
                <Box>
                  {previewMedia && (
                    <Box
                      paddingHorizontal="m"
                      paddingVertical="m"
                      backgroundColor="white"
                      borderTopWidth={1}
                      borderTopColor="grayLight"
                      style={styles.previewContainer}
                    >
                      <Box
                        flexDirection="row"
                        alignItems="center"
                        gap="m"
                        backgroundColor="pageBackground"
                        borderRadius={12}
                        padding="sm"
                      >
                        <Box
                          width={70}
                          height={70}
                          borderRadius={10}
                          overflow="hidden"
                          backgroundColor="grayLight"
                          style={styles.previewThumbnail}
                        >
                          {previewMedia.type === 'video' ? (
                            <Video
                              source={{ uri: previewMedia.uri }}
                              style={styles.thumbnailMedia}
                              resizeMode="cover"
                              paused
                            />
                          ) : (
                            <Image
                              source={{ uri: previewMedia.uri }}
                              style={styles.thumbnailMedia}
                              resizeMode="cover"
                            />
                          )}
                        </Box>
                        <Box flex={1}>
                          <AppText fontWeight="600" color="cutomBlack">
                            {previewMedia.type === 'video'
                              ? t('videoSelected')
                              : t('imageSelected')}
                          </AppText>
                          <AppText
                            variant="s2"
                            color="customGray"
                            marginTop="ss"
                          >
                            {previewMedia.type === 'video' ? '🎥' : '📷'}{' '}
                            {t('readyToSend')}
                          </AppText>
                        </Box>
                        <TouchableOpacity
                          onPress={cancelPreview}
                          disabled={isMediaLoaading}
                          style={[
                            styles.closeButton,
                            { backgroundColor: colors.grayLight },
                          ]}
                        >
                          <AppText fontSize={18} color="customGray">
                            ✕
                          </AppText>
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  )}
                  <InputToolbar {...props} />
                </Box>
              )}
            />
          );
        }}
      </BottomTabBarHeightContext.Consumer>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  previewContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  previewThumbnail: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  thumbnailMedia: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
