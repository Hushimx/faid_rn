import { Spinner } from '@ui-kitten/components';
import { AppPresseble, AppText } from 'components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

interface LoadingErrorScreenHandlerProps {
  loading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  refetch?: () => void;
  children: React.ReactNode;
}

export const LoadingErrorScreenHandler: React.FC<
  LoadingErrorScreenHandlerProps
> = ({ loading, isError, errorMessage, refetch, children }) => {
  const { t } = useTranslation();
  if (loading) {
    return (
      <View style={styles.center}>
        <Spinner status="primary" />
        <AppText variant="s1" color="primary" marginTop="sm">
          {t('loading')}...
        </AppText>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={[styles.text, styles.errorText]}>{errorMessage}</Text>
        {refetch && (
          <AppPresseble onPress={refetch}>
            <AppText variant="s1" color="primary" marginTop="sm">
              {t('refetch')}
            </AppText>
          </AppPresseble>
        )}
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
