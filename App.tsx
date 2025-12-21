import SplashScreen from '@abeman/react-native-splash-screen';
import * as eva from '@eva-design/eva';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AppRoot } from '@screens';
import { ThemeProvider } from '@shopify/restyle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApplicationProvider } from '@ui-kitten/components';
import theme from 'common/theme';
import i18n from 'i18n';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from 'store';
import { requestNotificationPermission } from 'utils';

const App = () => {
  const { isStoreReady } = useAuthStore();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 0, // 🔁 retry twice on error
        // retryDelay: 2000, // ⏱ wait 2 seconds between retries
      },
    },
  });

  useEffect(() => {
    let timeout: any;
    if (isStoreReady) {
      timeout = setTimeout(() => {
        SplashScreen.hide();
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [isStoreReady]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider style={styles.container}>
      <GestureHandlerRootView>
        <KeyboardProvider>
          <QueryClientProvider client={queryClient}>
            <ApplicationProvider {...eva} theme={eva.light}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <BottomSheetModalProvider>
                    <AppRoot />
                  </BottomSheetModalProvider>
                </I18nextProvider>
              </ThemeProvider>
            </ApplicationProvider>
          </QueryClientProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
