import { Box } from 'common';
import {
  AppButton,
  AppHeader,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  ChatItem,
  ChatItemSkeleton,
  Lock,
} from 'components';
import { LoadingErrorFlatListHandler } from 'hoc';
import { useChatsController } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from 'store';

const ChatsList = () => {
  const { t } = useTranslation();
  const { isGuestMode, setIsGuestMode } = useAuthStore();
  const {
    chats,
    isError,
    error,
    isLoading,
    isRefetching,
    isFetching,
    refetch,
    onChatPress,
  } = useChatsController();

  const handleLoginPress = () => {
    setIsGuestMode(false);
  };

  if (isGuestMode) {
    return (
      <Box flex={1} backgroundColor="pageBackground">
        <AppSpaceWrapper>
          <AppHeader label={t('chats')} />
          <AppSpacer variant="xl" />
          <Box
            flex={1}
            alignItems="center"
            justifyContent="center"
            paddingHorizontal="m"
          >
            <Box marginBottom="l">
              <Lock size={64} color="#464F67" />
            </Box>
            <AppText variant="h6" color="lightBlack" textAlign="center" marginBottom="m">
              {t('loginRequired')}
            </AppText>
            <AppText variant="s1" color="customGray" textAlign="center" marginBottom="xl">
              {t('pleaseLoginToAccessChats')}
            </AppText>
            <AppButton
              label={t('loginNow')}
              onPress={handleLoginPress}
              isFullWidth
            />
          </Box>
        </AppSpaceWrapper>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppSpaceWrapper>
        <AppHeader label={t('chats')} />
        <AppSpacer variant="sm" />

        <LoadingErrorFlatListHandler
          data={chats}
          isError={isError}
          errorMessage={error?.message}
          refetch={refetch}
          loading={isLoading}
          isRefetching={isRefetching}
          isFetching={isFetching}
          skeletonComponent={ChatItemSkeleton}
          skeletonCount={5}
          renderItem={({ item, index }) => (
            <ChatItem
              index={index}
              chat={item}
              onPress={() => onChatPress(item)}
            />
          )}
          ListEmptyComponent={
            !isLoading ? (
              <Box
                flex={1}
                alignItems="center"
                justifyContent="center"
                paddingTop="xl"
              >
                <AppText variant="s1" color="customGray">
                  {t('noChats')}
                </AppText>
              </Box>
            ) : null
          }
        />
      </AppSpaceWrapper>
    </Box>
  );
};

export default ChatsList;


