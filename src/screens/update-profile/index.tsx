import { Box } from 'common';
import {
  AppButton,
  AppHeader,
  AppInput,
  AppPresseble,
  AppSpacer,
  AppSpaceWrapper,
  LoadingTransparent,
  UserAvatar,
} from 'components';
import { useUpdateProfileController } from 'hooks';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

const UpdateProfile = () => {
  const { t } = useTranslation();
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
          </Box>
        </ScrollView>
      </AppSpaceWrapper>
      <Box position="absolute" bottom={10} width={'100%'}>
        <AppButton onPress={() => handleSubmit()} label={t('saveChanges')} />
      </Box>
      {isLoading && <LoadingTransparent />}
    </Box>
  );
};

export default UpdateProfile;
