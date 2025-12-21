import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Profile } from 'screens';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="profile"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
