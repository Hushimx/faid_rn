import { NavigationContainer } from '@react-navigation/native';
import { useAppTheme } from 'common';
import { AuthStack, BottomTab } from 'navigation';
import { StatusBar, AppState, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from 'store';
import { OnBoarding } from '../screens/auth';
import { useEffect, useRef } from 'react';

const AppRoot = () => {
  const { isLoggedIn, isOnBoarded, refreshUser, isGuestMode } = useAuthStore();
  const { colors } = useAppTheme();
  const appState = useRef(AppState.currentState);
  const canAccessApp = isLoggedIn || isGuestMode;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Refresh user data when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isLoggedIn &&
        !isGuestMode
      ) {
        // App has come to the foreground, refresh user data
        refreshUser();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isLoggedIn, isGuestMode, refreshUser]);

  // Fade animation when switching between navigators
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [canAccessApp, isOnBoarded]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: canAccessApp ? colors.pageBackground : colors.white,
      }}
    >
      <StatusBar backgroundColor={colors.primary} />
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {isOnBoarded ? (
          <NavigationContainer>
            {canAccessApp ? <BottomTab /> : <AuthStack />}
          </NavigationContainer>
        ) : (
          <OnBoarding />
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

export default AppRoot;