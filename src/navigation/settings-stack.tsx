import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Settings } from 'screens';
import { RootStackParamList } from 'types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Settings" component={Settings} />
   
    </Stack.Navigator>
  );
};

export default SettingsStack;
