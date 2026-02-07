import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Box, useAppTheme } from 'common';
import {
  AppPresseble,
  ChatIcon,
  HomeIcon,
  MarketplaceIcon,
  Plus,
  SettingsIcon,
  UserBottomTabIcon,
} from 'components';
import HomeStack from './home-stack';
import SettingsStack from './settings-stack';
import { Dimensions, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Chat,
  ChatsList,
  FullScreenMapView,
  Notifications,
  ServiceConditions,
  ServiceDetails,
  ServiceDetailsForm,
  EditService,
  ShowAllForCategory,
  ShowAllServices,
  UserPolicies,
  VendorApplication,
  VendorServices,
  VendorStore,
  Tickets,
  TicketDetail,
  CreateTicket,
  Favorites,
} from 'screens';
import { useAuthStore } from 'store';
import { USER_TYPE_ENUM } from 'types';
import UpdateProfile from 'screens/update-profile';
import { useNotificationListener } from 'hooks';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const CIRCLE_SIZE = 70;
const INNER_CIRCLE_SIZE = 50;

const { width } = Dimensions.get('window');

const ICONS = {
  HomeStack: (isActive: boolean) => <HomeIcon active={isActive} />,
  Profile: null,
  Settings: null,
};

const CustomTabBar = (props: any) => {
  const { state, navigation, userType, colors } = props;
  // Filter routes to exclude VendorServices if user is not a vendor
  const filteredRoutes = state.routes.filter((route: any) => {
    if (route.name === 'VendorServices') {
      return userType === USER_TYPE_ENUM.vendor;
    }
    return true;
  });

  return (
    <Box>
      <Box
        width={'100%'}
        backgroundColor="white"
        padding="m"
        borderTopLeftRadius={10}
        borderTopRightRadius={10}
        flexDirection="row"
        alignItems="center"
        height={60}
      >
        {filteredRoutes.map((route: any) => {
          // Find the original index in state.routes to determine if focused
          const originalIndex = state.routes.findIndex(
            (r: any) => r.key === route.key,
          );
          const isFocused = state.index === originalIndex;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <AppPresseble
              key={route?.name}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {route?.name === 'HomeStack' && <HomeIcon active={isFocused} />}
              {route?.name === 'ChatsList' && (
                <ChatIcon active={isFocused} />
              )}
              {route?.name === 'Profile' && (
                <UserBottomTabIcon active={isFocused} />
              )}
              {route?.name === 'VendorServices' && (
                <MarketplaceIcon active={isFocused} />
              )}
              {route?.name === 'Settings' && (
                <SettingsIcon active={isFocused} />
              )}
            </AppPresseble>
          );
        })}
      </Box>
      {userType === USER_TYPE_ENUM.vendor && (
        <AppPresseble
          style={[styles.addBtn]}
          onPress={() => navigation.navigate('ServiceDetailsForm')}
        >
          <Box
            alignItems="center"
            justifyContent="center"
            height={CIRCLE_SIZE}
            width={CIRCLE_SIZE}
            borderRadius={CIRCLE_SIZE / 2}
            backgroundColor={'pageBackground'}
          >
            <Box
              height={INNER_CIRCLE_SIZE}
              width={INNER_CIRCLE_SIZE}
              borderRadius={INNER_CIRCLE_SIZE / 2}
              backgroundColor="primary"
              alignItems="center"
              justifyContent="center"
            >
              <Plus color="white" />
            </Box>
          </Box>
        </AppPresseble>
      )}
    </Box>
  );
};

const BottomTab = () => {
  const { user } = useAuthStore();
  const { colors } = useAppTheme();
  useNotificationListener();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
      tabBar={props => (
        <CustomTabBar {...props} userType={user?.type} colors={colors} />
      )}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen
        name="ChatsList"
        component={ChatsList}
        options={{
          tabBarIcon: () => <ChatIcon />,
        }}
      />
      {/* <Tab.Screen
        name="MarketPlace"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color }) => <MarketplaceIcon />,
        }}
      /> */}
      {/* <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color }) => <UserBottomTabIcon active />,
        }}
      /> */}
      {user?.type === USER_TYPE_ENUM.vendor && (
        <Tab.Screen
          name="VendorServices"
          component={VendorServices as any}
          options={{
            tabBarIcon: ({ color }) => <MarketplaceIcon />,
          }}
        />
      )}
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarIcon: ({ color }) => <SettingsIcon />,
        }}
      />
    </Tab.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
      initialRouteName="BottomTab"
    >
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="ServiceDetailsForm" component={ServiceDetailsForm} />
      <Stack.Screen name="EditService" component={EditService as any} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetails as any} />
      <Stack.Screen
        name="ShowAllForCategory"
        component={ShowAllForCategory as any}
      />
      {/* <Stack.Screen name="VendorServices" component={VendorServices as any} /> */}
      <Stack.Screen name="Chat" component={Chat as any} />
      <Stack.Screen
        name="FullScreenMapView"
        component={FullScreenMapView as any}
      />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
      <Stack.Screen name="ServiceConditions" component={ServiceConditions} />
      <Stack.Screen name="UserPolicies" component={UserPolicies} />
      <Stack.Screen name="ShowAllServices" component={ShowAllServices} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="VendorApplication" component={VendorApplication} />
      <Stack.Screen name="VendorStore" component={VendorStore as any} />
      <Stack.Screen name="Tickets" component={Tickets} />
      <Stack.Screen name="Favorites" component={Favorites as any} />
      <Stack.Screen name="TicketDetail" component={TicketDetail as any} />
      <Stack.Screen name="CreateTicket" component={CreateTicket} />
    </Stack.Navigator>
  );
};

export default MainStack;

const styles = StyleSheet.create({
  addBtn: {
    position: 'absolute',
    top: -CIRCLE_SIZE + 10,
    left: width / 2 - CIRCLE_SIZE / 2,
  },
});
