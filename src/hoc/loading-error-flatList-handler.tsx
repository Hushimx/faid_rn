import { Spinner } from '@ui-kitten/components';
import { Box, IMAGES, SPACING, useAppTheme } from 'common';
import { AppImage, AppPresseble, AppText } from 'components';
import React, { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatListProps, RefreshControl, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { AnimatedProps } from 'react-native-reanimated';
import {
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as <T>(
  props: AnimatedProps<FlatListProps<T>>,
) => JSX.Element;
interface LoadingFlatListProps<T> extends FlatListProps<T> {
  loading: boolean;
  isError?: boolean;
  errorMessage?: string;
  refetch?: () => void;
  isRefetching?: boolean;
  isFetching?: boolean;
  infiniteQueryOptions?: UseInfiniteQueryOptions;
  dataExtractor?: (page: any) => T[];
}

/**
 * A wrapper for FlatList that shows a loading spinner until data is ready.
 * Supports both manual data passing and useInfiniteQuery integration.
 */
export function LoadingErrorFlatListHandler<T>({
  loading,
  data,
  isError,
  errorMessage,
  refetch,
  isRefetching,
  isFetching,
  infiniteQueryOptions,
  dataExtractor,
  ...rest
}: LoadingFlatListProps<T>) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  // console.log('loading', queryIsPending);
  // console.log('fetching', queryIsFetching);

  if (loading) {
    return (
      <View style={styles.center}>
        <Spinner size="large" status="primary" />
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.center}>
        <AppImage source={IMAGES.error} style={styles.errorImg} />
        <AppText color="red" marginTop="sm">
          {errorMessage}
        </AppText>
        <AppPresseble onPress={refetch}>
          <AppText color="primary" variant="m">
            {t('refetch')}
          </AppText>
        </AppPresseble>
      </View>
    );
  }

  return (
    <AnimatedFlatList
      data={data}
      contentContainerStyle={[
        {
          gap: SPACING.gap,

          //to center the empty component
          ...(!rest?.horizontal &&
            !data?.length && {
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }),
        },
        rest?.contentContainerStyle,
      ]}
      refreshControl={
        <RefreshControl
          colors={[colors.primary]}
          refreshing={isRefetching ?? false}
          onRefresh={refetch}
        />
      }
      ListFooterComponent={() =>
        isFetching && (
          <Box alignItems="center" justifyContent="center">
            <Spinner status="primary" />
          </Box>
        )
      }
      ListEmptyComponent={() => (
        <Box alignItems="center" justifyContent="center" marginTop="xxl">
          <AppText color="primary" variant="h6">
            {t('noData')}
          </AppText>
        </Box>
      )}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorImg: {
    height: 100,
    width: 100,
  },
});
