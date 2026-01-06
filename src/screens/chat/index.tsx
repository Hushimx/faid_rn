import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Spinner } from '@ui-kitten/components';
import { Box, useAppTheme } from 'common';
import { AppHeader, AppText } from 'components';
import { LocationPin, Plus } from 'components/icons';
import { useChatController } from 'hooks';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Actions,
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import Video from 'react-native-video';
import { useAuthStore } from 'store';
import { RootStackParamList } from 'types';
import { FullscreenMapModal } from './components';
import LocationMessageViewer from './components/location-message-viewer';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

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
    openLocationPicker,
    mapModalRef,
    handleLocationSelect,
  } = useChatController({
    chatId,
  });
  const [showActions, setShowActions] = useState(false);
  const [viewingLocation, setViewingLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { colors } = useAppTheme();
  
  const closeImageModal = useCallback(() => {
    setViewingImage(null);
  }, []);

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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
        {showActions && (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.pageBackground,
              borderRadius: 20,
              padding: 4,
              marginRight: 8,
              borderWidth: 1,
              borderColor: colors.grayLight,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                pickMedia();
                setShowActions(false);
              }}
              style={{
                padding: 8,
                marginHorizontal: 4,
              }}
            >
              <Plus size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                openLocationPicker();
                setShowActions(false);
              }}
              style={{
                padding: 8,
                marginHorizontal: 4,
              }}
            >
              <LocationPin size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        <Actions
          onPressActionButton={() => setShowActions(!showActions)}
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
      </View>
    ),
    [isMediaLoaading, showActions, colors, pickMedia, openLocationPicker],
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
      <AppHeader
        label={vendor?.name}
        isChatHeader
        imageUrl={vendor?.profile_picture}
      />
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
                springConfig: {
                  tension: 65,
                  friction: 11,
                },
                renderHeader: () => null,
                renderContent: (props: any) => (
                  <Image
                    source={{ uri: props.source?.uri }}
                    style={{
                      flex: 1,
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                    }}
                  />
                ),
              }}
              renderMessageImage={props => {
                const isPending = props.currentMessage?.pending;
                const imageUri = props.currentMessage?.image;
                const imageWidth = Math.min(width * 0.6, 220); // Smaller images: 60% of screen width or max 220
                const imageHeight = imageWidth * 1.1; // Slightly taller aspect ratio
                
                // For pending messages, show loading overlay
                if (isPending) {
                  return (
                    <View
                      style={{
                        height: imageHeight,
                        width: imageWidth,
                        borderRadius: 10,
                        overflow: 'hidden',
                        backgroundColor: colors.grayLight,
                      }}
                    >
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          zIndex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        pointerEvents="none"
                      >
                        <Spinner status="primary" />
                        <AppText
                          variant="s2"
                          color="white"
                          marginTop="s"
                          textAlign="center"
                        >
                          Sending...
                        </AppText>
                      </View>
                      <Image
                        source={{ uri: imageUri }}
                        style={{ flex: 1, width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    </View>
                  );
                }
                
                // For non-pending messages, use TouchableOpacity with custom modal for proper RTL support
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setViewingImage(imageUri)}
                    style={{
                      height: imageHeight,
                      width: imageWidth,
                      borderRadius: 10,
                      overflow: 'hidden',
                      backgroundColor: colors.grayLight,
                    }}
                  >
                    <Image
                      source={{ uri: imageUri }}
                      style={{ flex: 1, width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                );
              }}
              renderBubble={props => {
                const isPending = props.currentMessage?.pending;
                const hasImage = !!props.currentMessage?.image;
                const hasVideo = !!props.currentMessage?.video;
                const hasLocation = !!props.currentMessage?.location;
                const hasText = props.currentMessage?.text && props.currentMessage.text.trim().length > 0;
                
                // Add padding to text when there's media
                const bubbleProps = {
                  ...props,
                  containerStyle: {
                    ...props.containerStyle,
                    ...((hasImage || hasVideo || hasLocation) && hasText ? {
                      paddingBottom: 8,
                      paddingTop: 8,
                    } : {}),
                  },
                };
                
                // Only add loading overlay for pending video/location messages
                // Images are handled by renderMessageImage (only for pending)
                if (isPending && (hasVideo || hasLocation) && !hasImage) {
                  return (
                    <View style={{ position: 'relative' }}>
                      <Bubble {...bubbleProps} />
                      {/* Loading overlay */}
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          borderRadius: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        pointerEvents="none"
                      >
                        <Spinner status="primary" />
                        <AppText
                          variant="s2"
                          color="white"
                          marginTop="s"
                          textAlign="center"
                        >
                          Sending...
                        </AppText>
                      </View>
                    </View>
                  );
                }
                
                return <Bubble {...bubbleProps} />;
              }}
              renderMessageVideo={props => {
                const isPending = props.currentMessage?.pending;
                return (
                  <View
                    style={{
                      height: 200,
                      width: 250,
                      borderRadius: 10,
                      overflow: 'hidden',
                      backgroundColor: colors.cutomBlack,
                    }}
                  >
                    {isPending && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          zIndex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        pointerEvents="none"
                      >
                        <Spinner status="primary" />
                        <AppText
                          variant="s2"
                          color="white"
                          marginTop="s"
                          textAlign="center"
                        >
                          Sending...
                        </AppText>
                      </View>
                    )}
                    <Video
                      source={{ uri: props.currentMessage?.video }}
                      style={{ flex: 1 }}
                      resizeMode="cover"
                      controls
                      paused
                    />
                  </View>
                );
              }}
              renderCustomView={props => {
                const location = props.currentMessage?.location;
                const isPending = props.currentMessage?.pending;
                if (!location) return null;
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => !isPending && setViewingLocation(location)}
                    disabled={isPending}
                  >
                    <Box
                      height={200}
                      width={250}
                      borderRadius={10}
                      overflow="hidden"
                      backgroundColor="grayLight"
                      marginBottom="s"
                      borderWidth={1}
                      borderColor="grayLight"
                      position="relative"
                    >
                      {isPending && (
                        <View
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          pointerEvents="none"
                        >
                          <Spinner status="primary" />
                          <AppText
                            variant="s2"
                            color="white"
                            marginTop="s"
                            textAlign="center"
                          >
                            Sending...
                          </AppText>
                        </View>
                      )}
                      <MapView
                        style={{ flex: 1 }}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                          latitude: location.latitude,
                          longitude: location.longitude,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        rotateEnabled={false}
                      >
                        <Marker
                          coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                          }}
                        />
                      </MapView>
                      {/* Tap indicator */}
                      {!isPending && (
                        <Box
                          position="absolute"
                          bottom={8}
                          left={8}
                          right={8}
                          padding="s"
                          borderRadius={6}
                          alignItems="center"
                          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                        >
                          <AppText variant="s2" color="white">
                            📍 Tap to view on map
                          </AppText>
                        </Box>
                      )}
                    </Box>
                  </TouchableOpacity>
                );
              }}
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
      <FullscreenMapModal
        ref={mapModalRef}
        onSelectLocation={handleLocationSelect}
      />
      {viewingLocation && (
        <LocationMessageViewer
          location={viewingLocation}
          visible={!!viewingLocation}
          onClose={() => setViewingLocation(null)}
        />
      )}
      {/* Custom Image Modal with simple fade animation */}
      <Modal
        visible={!!viewingImage}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
        statusBarTranslucent
      >
        <StatusBar barStyle="light-content" />
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.95)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={closeImageModal}
        >
          {viewingImage && (
            <Image
              source={{ uri: viewingImage }}
              style={{
                width: width,
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          )}
        </Pressable>
      </Modal>
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
