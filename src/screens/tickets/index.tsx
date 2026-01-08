import { Box, useAppTheme } from 'common';
import {
  AppHeader,
  AppPresseble,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  AppSearchInput,
  TicketsFilterModal,
} from 'components';
import { LoadingErrorFlatListHandler } from 'hoc';
import { useTicketsController } from 'hooks';
import { useTranslation } from 'react-i18next';
import TicketItem from 'components/items/ticket-item';
import { useRef } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TicketStatus, TicketPriority, IModalRef } from 'types';

const Tickets = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const {
    tickets,
    isError,
    error,
    isLoading,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
    onTicketPress,
    onCreateTicketPress,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
  } = useTicketsController();

  const filterModalRef = useRef<IModalRef>(null);

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppSpaceWrapper>
        <AppHeader label={t('tickets')} />
        <AppSpacer variant="sm" />

        {/* Search Bar */}
        <Box marginBottom="s">
          <AppSearchInput
            placeholder={t('searchTickets')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </Box>

        {/* Filters Row: Create Ticket + Filter Button */}
        <Box marginBottom="s">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Box flexDirection="row" alignItems="center">
              <TicketsFilterModal
                ref={filterModalRef}
                onSelectStatus={setStatusFilter}
                onSelectPriority={setPriorityFilter}
                selectedStatus={statusFilter}
                selectedPriority={priorityFilter}
              />
              {/* Create Ticket Button */}
              <AppPresseble onPress={onCreateTicketPress}>
                <Box
                  backgroundColor="primary"
                  borderRadius={12}
                  paddingHorizontal="m"
                  paddingVertical="s"
                  marginLeft="s"
                >
                  <AppText color="white" variant="s2" fontWeight="700">
                    {t('createTicket')}
                  </AppText>
                </Box>
              </AppPresseble>
            </Box>
          </ScrollView>
        </Box>

        <LoadingErrorFlatListHandler
          data={tickets}
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
            <TicketItem
              ticket={item}
              index={index}
              onPress={() => onTicketPress(item)}
            />
          )}
          emptyMessage={t('noTicketsFound')}
        />
      </AppSpaceWrapper>
    </Box>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    marginBottom: 8,
  },
});

export default Tickets;

