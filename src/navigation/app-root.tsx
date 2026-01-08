import { NavigationContainer } from '@react-navigation/native';
import { useAppTheme } from 'common';
import { AuthStack, BottomTab } from 'navigation';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from 'store';
import { OnBoarding } from '../screens/auth';

const AppRoot = () => {
  const { isLoggedIn, isOnBoarded } = useAuthStore();
  const { colors } = useAppTheme();
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