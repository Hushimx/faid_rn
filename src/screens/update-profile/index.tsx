import { Box, useAppTheme } from 'common';
import {
  AppButton,
  AppHeader,
  AppInput,
  AppPresseble,
  AppSpacer,
  AppSpaceWrapper,
  LoadingTransparent,
  Trash,
  UserAvatar,
} from 'components';
import { useUpdateProfileController } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { ScrollView } from 'react-native';
import { useAuthStore } from 'store';
import { IModalRef } from 'types';
import { ShowSnackBar } from 'utils';
import { DeleteAccountConfirmationModal } from '../settings/components';

const UpdateProfile = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { deleteAccount } = useAuthStore();
  const deleteAccountConfirmationModalRef = useRef<IModalRef>(null);
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    onSelectImagePress,
    isLoading,
  } = useUpdateProfileController();

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppHeader label={t('editProfile')} />

      <AppSpaceWrapper>
        <ScrollView style={{ flex: 1 }}>
          <Box alignItems="center" justifyContent="center">
            <AppSpacer variant="xl" />
            <AppPresseble onPress={onSelectImagePress}>
              <UserAvatar
                style={{ height: 150, width: 150 }}
                image={
                  typeof values.profileImage === 'string'
                    ? values.profileImage
                    : values.profileImage?.uri
                }
              />
            </AppPresseble>
            <AppSpacer variant="xl" />
            <Box
              backgroundColor="white"
              borderRadius={15}
              width={'100%'}
              padding="m"
            >
              <AppInput
                label={t('firstName')}
                value={values.firstName!}
                onChangeText={handleChange('firstName')}
                caption={errors.firstName}
                touched={touched.firstName}
              />
              <AppSpacer variant="s" />
              <AppInput
                label={t('lastName')}
                value={values.lastName!}
                onChangeText={handleChange('lastName')}
                caption={errors.lastName}
                touched={touched.lastName}
              />
              <AppSpacer variant="s" />
            </Box>
            <AppSpacer variant="xl" />
            <Box width={'100%'}>
              <AppButton
                onPress={() => deleteAccountConfirmationModalRef?.current?.openModal()}
                label={t('deleteAccount') || 'Delete Account'}
                isOutLined
                textColor="red"
                style={{ borderColor: colors.red }}
                icon={
                  <Box marginRight="s">
                    <Trash size={18} color={colors.red} />
                  </Box>
                }
              />
            </Box>
          </Box>
        </ScrollView>
      </AppSpaceWrapper>
      <Box position="absolute" bottom={10} width={'100%'} paddingHorizontal="m">
        <AppButton onPress={() => handleSubmit()} label={t('saveChanges')} />
      </Box>
      {isLoading && <LoadingTransparent />}
      <DeleteAccountConfirmationModal
        ref={deleteAccountConfirmationModalRef}
        onConfirm={async () => {
          try {
            await deleteAccount();
            ShowSnackBar({
              text: t('accountDeletedSuccessfully') || 'Account deleted successfully',
            });
            // Navigation will automatically redirect to Login when isLoggedIn becomes false
            // via the AppRoot component
          } catch (error) {
            ShowSnackBar({
              text: t('errors.failedToDeleteAccount') || 'Failed to delete account. Please try again.',
              type: 'error',
            });
            console.error('Error deleting account:', error);
          }
        }}
      />
    </Box>
  );
};

export default UpdateProfile;
