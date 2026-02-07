import { useNavigation, CommonActions } from '@react-navigation/native';
import { Box, useAppTheme } from 'common';
import {
  AppButton,
  AppHeader,
  AppLineSeparator,
  AppPresseble,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  Chevron,
  EditIcon,
  InfoCircleIcon,
  LanguageIcon,
  Lock,
  LogoutIcon,
  MessageIcon,
  TicketIcon,
  UserAvatar,
} from 'components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from 'store';
import { IModalRef } from 'types';
import { ChooseLanguageModal, LogoutConfirmationModal } from './components';
import { ScrollView } from 'react-native';

const Settings = () => {
  const { t } = useTranslation();
  const { user, logout, isGuestMode, setIsGuestMode } = useAuthStore();
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const chooseLanguageModalRef = useRef<IModalRef>(null);
  const logoutConfirmationModalRef = useRef<IModalRef>(null);

  const handleLoginPress = () => {
    setIsGuestMode(false);
  };

  if (isGuestMode) {
    return (
      <Box flex={1} backgroundColor="pageBackground">
        <AppHeader label={t('settings')} />
        <AppSpaceWrapper>
          <AppSpacer variant="xl" />
          <Box
            flex={1}
            alignItems="center"
            justifyContent="center"
            paddingHorizontal="m"
          >
            <Box marginBottom="l">
              <Lock size={64} color="#464F67" />
            </Box>
            <AppText variant="h6" color="lightBlack" textAlign="center" marginBottom="m">
              {t('loginRequired')}
            </AppText>
            <AppText variant="s1" color="customGray" textAlign="center" marginBottom="xl">
              {t('pleaseLoginToAccessSettings')}
            </AppText>
            <AppButton
              label={t('loginNow')}
              onPress={handleLoginPress}
              isFullWidth
            />
          </Box>
        </AppSpaceWrapper>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppHeader label={t('settings')} />
      <AppSpaceWrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          <AppSpacer />
          <AppPresseble
            onPress={() => {
              if (user?.type === 'vendor' && user?.id) {
                navigation.navigate('VendorStore', { vendorId: user.id });
              }
            }}
            disabled={user?.type !== 'vendor'}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              backgroundColor="white"
              borderRadius={30}
              padding="m"
            >
              <Box flex={1} alignItems="center" justifyContent="center">
                <UserAvatar size="giant" image={user?.profile_picture} />
              </Box>
              <Box flex={5} paddingLeft="ml" alignItems="flex-start">
                <AppText variant="s1">{user?.name}</AppText>
              </Box>

              <Box flex={1} alignItems="center" justifyContent="center">
                <AppPresseble
                  onPress={() => navigation.navigate('UpdateProfile')}
                >
                  <EditIcon />
                </AppPresseble>
              </Box>
            </Box>
          </AppPresseble>
          {/* <AppSpacer /> */}

          {/* <Box
          flexDirection="row"
          alignItems="center"
          backgroundColor="white"
          borderRadius={30}
          padding="sm"
        >
          <Box flex={1} alignItems="center" justifyContent="center">
            <NotificationOffIcon />
          </Box>
          <Box flex={8} alignItems="flex-start">
            <AppText variant="s1">{t('notificationOff')}</AppText>
          </Box>

          <Box flex={1.5} alignItems="center" justifyContent="center">
            <AppSwitch isEnabled toggleSwitch={() => {}} />
          </Box>
        </Box> */}
          <AppSpacer />
          <AppPresseble
            onPress={() => chooseLanguageModalRef?.current?.openModal()}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              backgroundColor="white"
              borderRadius={30}
              padding="sm"
            >
              <Box flex={1} alignItems="center" justifyContent="center">
                <LanguageIcon />
              </Box>
              <Box flex={8} alignItems="flex-start">
                <AppText variant="s1">{t('langauge')}</AppText>
              </Box>

              <Box flex={1} alignItems="center" justifyContent="center">
                <Chevron size={15} />
              </Box>
            </Box>
          </AppPresseble>
          <AppSpacer />
          <AppPresseble onPress={() => navigation.navigate('Tickets')}>
            <Box
              flexDirection="row"
              alignItems="center"
              backgroundColor="white"
              borderRadius={30}
              padding="sm"
            >
              <Box flex={1} alignItems="center" justifyContent="center">
                <TicketIcon />
              </Box>
              <Box flex={8} alignItems="flex-start">
                <AppText variant="s1">{t('tickets')}</AppText>
              </Box>

              <Box flex={1} alignItems="center" justifyContent="center">
                <Chevron size={15} />
              </Box>
            </Box>
          </AppPresseble>
          <AppSpacer />
          {user?.type === 'user' && (
            <>
              <AppPresseble
                onPress={() => navigation.navigate('VendorApplication')}
              >
                <Box
                  flexDirection="row"
                  alignItems="center"
                  backgroundColor="white"
                  borderRadius={30}
                  padding="sm"
                >
                  <Box flex={1} alignItems="center" justifyContent="center">
                    <InfoCircleIcon />
                  </Box>
                  <Box flex={8} alignItems="flex-start">
                    <AppText variant="s1">{t('becomeVendor')}</AppText>
                  </Box>

                  <Box flex={1} alignItems="center" justifyContent="center">
                    <Chevron size={15} />
                  </Box>
                </Box>
              </AppPresseble>
              <AppSpacer />
            </>
          )}

          <AppSpacer />
          <AppPresseble onPress={() => navigation.navigate('Favorites')}>
            <Box
              flexDirection="row"
              alignItems="center"
              backgroundColor="white"
              borderRadius={30}
              padding="sm"
            >
              <Box flex={1} alignItems="center" justifyContent="center">
                <MaterialIcons name="favorite" size={22} color="#3E4453" />
              </Box>
              <Box flex={8} alignItems="flex-start">
                <AppText variant="s1">{t('myFavorites')}</AppText>
              </Box>

              <Box flex={1} alignItems="center" justifyContent="center">
                <Chevron size={15} />
              </Box>
            </Box>
          </AppPresseble>
          <AppSpacer />

          <Box width={'100%'} borderRadius={30} backgroundColor="white">
            {/* <Box flexDirection="row" alignItems="center" padding="sm">
            <Box flex={1} alignItems="center" justifyContent="center">
              <QuestionCircleIcon />
            </Box>
            <Box flex={8} alignItems="flex-start">
              <AppText variant="s1">{t('faqs')}</AppText>
            </Box>

            <Box flex={1} alignItems="center" justifyContent="center">
              <Chevron size={15} />
            </Box>
          </Box> */}
            <Box width={'90%'} alignSelf="center">
              <AppLineSeparator />
            </Box>
            <AppPresseble
              onPress={() => navigation.navigate('ServiceConditions')}
            >
              <Box flexDirection="row" alignItems="center" padding="sm">
                <Box flex={1} alignItems="center" justifyContent="center">
                  <InfoCircleIcon />
                </Box>
                <Box flex={8} alignItems="flex-start">
                  <AppText variant="s1">{t('serviceConditions')}</AppText>
                </Box>

                <Box flex={1} alignItems="center" justifyContent="center">
                  <Chevron size={15} />
                </Box>
              </Box>
            </AppPresseble>
            <Box width={'90%'} alignSelf="center">
              <AppLineSeparator />
            </Box>
            <AppPresseble onPress={() => navigation.navigate('UserPolicies')}>
              <Box flexDirection="row" alignItems="center" padding="sm">
                <Box flex={1} alignItems="center" justifyContent="center">
                  <InfoCircleIcon />
                </Box>
                <Box flex={8} alignItems="flex-start">
                  <AppText variant="s1">{t('userPolicy')}</AppText>
                </Box>

                <Box flex={1} alignItems="center" justifyContent="center">
                  <Chevron size={15} />
                </Box>
              </Box>
            </AppPresseble>
          </Box>
          <AppSpacer variant="xl" />
          <Box width={'100%'}>
            <AppButton
              onPress={() => logoutConfirmationModalRef?.current?.openModal()}
              label={t('logout')}
              isOutLined
              textColor="red"
              style={{ borderColor: colors.red }}
              icon={
                <Box marginRight="s">
                  <LogoutIcon />
                </Box>
              }
            />
          </Box>
        </ScrollView>
      </AppSpaceWrapper>

      <ChooseLanguageModal ref={chooseLanguageModalRef} />
      <LogoutConfirmationModal
        ref={logoutConfirmationModalRef}
        onConfirm={logout}
      />
    </Box>
  );
};

export default Settings;
