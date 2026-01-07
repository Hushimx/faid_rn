import { Box } from 'common';
import {
  AppHeader,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  ChatItem,
  ChatItemSkeleton,
} from 'components';
import { LoadingErrorFlatListHandler } from 'hoc';
import { useChatsController } from 'hooks';
import { useTranslation } from 'react-i18next';

const ChatsList = () => {
  const { t } = useTranslation();
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


