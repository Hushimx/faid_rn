import { Box, useAppTheme } from 'common';
import {
  AppButton,
  AppErrorMessage,
  AppHeader,
  AppInput,
  AppKeyboardAwareScrollView,
  AppPresseble,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  AppTextArea,
  LoadingTransparent,
  LocationPin,
} from 'components';
import { useVendorApplicationController } from 'hooks';
import { useTranslation } from 'react-i18next';
import { AppDropdown } from '../service-details-form/components';

const VendorApplication = () => {
  const { t } = useTranslation();
  const {
    formik,
    isSubmitting,
    categoriesWithOthers,
    onSelectCategory,
    existingApplication,
    isApplicationLoading,
  } = useVendorApplicationController();
  const { values, errors, touched, handleSubmit } = formik;
  const { business_name, city, bio, category_id, custom_category } = values;
  const { colors } = useAppTheme();
  const isOthersSelected = category_id === 'others';

  // If application exists, show status
  if (existingApplication) {
    const getStatusColor = () => {
      switch (existingApplication.status) {
        case 'approved':
          return 'primary';
        case 'rejected':
          return 'red';
        default:
          return 'customYellow';
      }
    };

    const getStatusBgColor = () => {
      switch (existingApplication.status) {
        case 'approved':
          return 'primaryLight';
        case 'rejected':
          return 'lightBlue';
        default:
          return 'purple';
      }
    };

    const getStatusText = () => {
      switch (existingApplication.status) {
        case 'approved':
          return t('approved');
        case 'rejected':
          return t('rejected');
        default:
          return t('pending');
      }
    };

    return (
      <Box flex={1} backgroundColor="pageBackground">
        <AppHeader label={t('vendorApplication')} />
        <AppSpaceWrapper>
          <AppKeyboardAwareScrollView>
            <AppSpacer variant="xl" />
            <Box
              backgroundColor="white"
              borderRadius={15}
              width={'100%'}
              padding="m"
              alignItems="center"
            >
              <AppText variant="h4" fontWeight="700" marginBottom="m">
                {t('applicationStatus')}
              </AppText>
              <Box
                padding="m"
                borderRadius={10}
                backgroundColor={getStatusBgColor()}
                marginBottom="m"
                width={'100%'}
                alignItems="center"
              >
                <AppText
                  variant="h5"
                  color={getStatusColor()}
                  fontWeight="700"
                >
                  {getStatusText()}
                </AppText>
              </Box>

              {existingApplication.status === 'rejected' &&
                existingApplication.rejection_reason && (
                  <>
                    <AppSpacer variant="s" />
                    <Box width={'100%'}>
                      <AppText variant="s1" fontWeight="600" marginBottom="ss">
                        {t('rejectionReason')}:
                      </AppText>
                      <AppText variant="s2" color="customGray">
                        {existingApplication.rejection_reason}
                      </AppText>
                    </Box>
                  </>
                )}

              {existingApplication.status === 'pending' && (
                <>
                  <AppSpacer variant="m" />
                  <AppText variant="s2" color="customGray" textAlign="center">
                    {t('applicationPendingMessage')}
                  </AppText>
                </>
              )}

              {existingApplication.status === 'approved' && (
                <>
                  <AppSpacer variant="m" />
                  <AppText variant="s2" color="customGray" textAlign="center">
                    {t('applicationApprovedMessage')}
                  </AppText>
                </>
              )}

              <AppSpacer variant="m" />
              <AppText variant="s3" color="customGray">
                {t('submittedOn')}:{' '}
                {new Date(existingApplication.created_at).toLocaleDateString()}
              </AppText>
            </Box>
          </AppKeyboardAwareScrollView>
        </AppSpaceWrapper>
        {isApplicationLoading && <LoadingTransparent />}
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppHeader label={t('vendorApplication')} />
      <AppKeyboardAwareScrollView>
        <AppSpaceWrapper>
          <AppSpacer variant="ml" />

          <AppText fontWeight={'700'}>{t('vendorApplication')}</AppText>
          <AppSpacer variant="s" />

          <AppInput
            label={t('businessName')}
            placeholder={t('enterBusinessName')}
            value={business_name || ''}
            onChangeText={formik.handleChange('business_name')}
            touched={touched.business_name}
            caption={errors.business_name}
          />

          <AppSpacer variant="s" />

          <AppDropdown
            data={categoriesWithOthers}
            onSelect={onSelectCategory}
            value={category_id}
            placeholder={t('selectCategory')}
            label={t('category')}
            error={errors?.category_id}
            touched={touched?.category_id}
          />

          {isOthersSelected && (
            <>
              <AppSpacer variant="s" />
              <AppInput
                label={t('customCategory')}
                placeholder={t('enterCustomCategory')}
                value={custom_category || ''}
                onChangeText={formik.handleChange('custom_category')}
                touched={touched.custom_category}
                caption={errors.custom_category}
              />
            </>
          )}

          <AppSpacer variant="s" />

          <AppTextArea
            label={t('bio')}
            placeholder={t('enterBriefAboutServiceProvider')}
            value={bio || ''}
            onChangeText={formik.handleChange('bio')}
            touched={touched.bio}
            caption={errors.bio}
            maxLength={1000}
          />

          <AppSpacer variant="s" />

          <AppInput
            label={t('city')}
            placeholder={t('enterCity') || 'Enter city name'}
            value={city || ''}
            onChangeText={formik.handleChange('city')}
            touched={touched.city}
            caption={errors.city}
            accessoryRight={() => <LocationPin />}
          />

          <AppSpacer variant="xl" />
        </AppSpaceWrapper>
      </AppKeyboardAwareScrollView>

      <Box position="absolute" bottom={5} width={'100%'}>
        <AppButton
          onPress={() => handleSubmit()}
          label={t('submitApplication')}
          isLoading={isSubmitting}
        />
      </Box>

      {isSubmitting && <LoadingTransparent />}
    </Box>
  );
};

export default VendorApplication;

