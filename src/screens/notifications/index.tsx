import { Box } from 'common';
import {
  AppHeader,
  AppPresseble,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  NotificationItem,
} from 'components';
import { LoadingErrorFlatListHandler } from 'hoc';
import { useNotificationsController } from 'hooks';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';

const Notifications = () => {
  const { t } = useTranslation();
  const {
    allData,
    isError,
    error,
    isLoading,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
    unreadCount,
    handleMarkAllAsRead,
    isMarkingAllAsRead,
    onNotificationPress,
  } = useNotificationsController();

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppSpaceWrapper>
        <AppHeader label={t('notifications')} />
        <AppSpacer variant="sm" />

        {/* Mark All as Read Button */}
        {unreadCount > 0 && !isLoading && (
          <>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="s"
            >
              <AppText color="customGray" variant="s2">
                {unreadCount} {t('unreadNotifications')}
              </AppText>
              <AppPresseble
                onPress={handleMarkAllAsRead}
                isLoading={isMarkingAllAsRead}
              >
                <AppText color="primary" variant="s2" fontWeight="700">
                  {t('markAllAsRead')}
                </AppText>
              </AppPresseble>
            </Box>
            <AppSpacer variant="ss" />
          </>
        )}

        <LoadingErrorFlatListHandler
          data={allData}
          isError={isError}
          errorMessage={error?.message}
          refetch={refetch}
          loading={isLoading}
          isRefetching={isRefetching}
          isFetching={isFetching || isFetchingNextPage}
          onEndReached={
            hasNextPage && !isFetchingNextPage
              ? () => fetchNextPage()
              : undefined
          }
          renderItem={({ item, index }) => (
            <NotificationItem
              body={item?.data?.body[I18nManager.isRTL ? 'ar' : 'en']}
              title={item?.data?.title[I18nManager.isRTL ? 'ar' : 'en']}
              readAt={item?.read_at}
              createdAt={item?.created_at}
              index={index}
              onPress={() =>
                onNotificationPress({
                  id: item?.id,
                  read_at: item?.read_at,
                  serviceId: item?.data?.service_id,
                })
              }
            />
          )}
        />
      </AppSpaceWrapper>
    </Box>
  );
};

export default Notifications;
