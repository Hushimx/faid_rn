import { NavigationContainer } from '@react-navigation/native';
import { useAppTheme } from 'common';
import { AuthStack, BottomTab } from 'navigation';
import { StatusBar, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from 'store';
import { OnBoarding } from '../screens/auth';
import { useEffect, useRef } from 'react';

const AppRoot = () => {
  const { isLoggedIn, isOnBoarded, refreshUser } = useAuthStore();
  const { colors } = useAppTheme();
  const appState = useRef(AppState.currentState);

  // Refresh user data when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isLoggedIn
      ) {
        // App has come to the foreground, refresh user data
        refreshUser();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isLoggedIn, refreshUser]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isLoggedIn ? colors.pageBackground : colors.white,
      }}
    >
      <StatusBar backgroundColor={colors.primary} />
      {isOnBoarded ? (
        <NavigationContainer>
          {isLoggedIn ? <BottomTab /> : <AuthStack />}
        </NavigationContainer>
      ) : (
        <OnBoarding />
      )}
    </SafeAreaView>
  );
};

export default AppRoot;