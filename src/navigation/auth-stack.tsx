import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EnterOtp, ForgetPassword, Login } from 'screens';
import ResetPassword from 'screens/auth/reset-password';
import SignUp from 'screens/auth/sign-up';
import { RootStackParamList } from 'types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="EnterOtp" component={EnterOtp} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;
