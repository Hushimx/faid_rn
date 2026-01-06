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
  CitiesModal,
  LoadingTransparent,
  LocationPin,
  UplaodBox,
} from 'components';
import { useVendorApplicationController } from 'hooks';
import { useTranslation } from 'react-i18next';
import { AppDropdown, MapModal } from '../service-details-form/components';

const VendorApplication = () => {
  const { t } = useTranslation();
  const {
    formik,
    onUploadBanner,
    onUserSelectLocation,
    isLocationLoading,
    isSubmitting,
    mapModalRef,
    citiesModalRef,
    onSelectCity,
    selectedCity,
    categoriesWithOthers,
    onSelectCategory,
    existingApplication,
    isApplicationLoading,
  } = useVendorApplicationController();
  const { values, errors, touched, handleSubmit } = formik;
  const { banner, bio, fullLocation, category_id, custom_category } = values;
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

          <AppText color="grayDark" variant="s1">
            {t('bannerImage')}
          </AppText>
          <AppSpacer variant="ss" />
          <UplaodBox
            title={t('uplaodImage')}
            subTitle={t('maxUploadSize')}
            onPress={onUploadBanner}
            image={banner?.uri ? { uri: banner.uri } : undefined}
            isError={!!touched?.banner && !!errors?.banner}
          />
          <AppErrorMessage
            text={errors?.banner!}
            isError={!!touched?.banner && !!errors?.banner}
          />

          <AppSpacer variant="sm" />

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

          <AppSpacer variant="ml" />
          <AppText fontWeight={'700'}>{t('location')}</AppText>
          <AppSpacer variant="s" />

          <AppPresseble
            onPress={() => citiesModalRef.current?.openModal()}
            disabled={isLocationLoading}
          >
            <AppInput
              label={t('city')}
              placeholder={t('selectCity')}
              value={selectedCity ? selectedCity.name : ''}
              editable={false}
              accessoryRight={() => <LocationPin />}
            />
          </AppPresseble>

          <AppSpacer variant="s" />

          <AppTextArea
            label={t('fullLocation')}
            placeholder={t('enterFullLocation')}
            value={fullLocation}
            onChangeText={formik.handleChange('fullLocation')}
            touched={touched.fullLocation}
            caption={errors.fullLocation}
            editable={!isLocationLoading && fullLocation?.length > 0}
          />
          <AppSpacer variant="s" />
          <AppButton
            label={t('selectLocationOnMap')}
            isOutLined
            onPress={() => mapModalRef.current?.openModal()}
            style={{ width: '100%' }}
            isLoading={isLocationLoading}
            loadingStatus={'primary'}
            icon={
              <Box marginRight="s">
                <LocationPin size={20} color={colors.primary} />
              </Box>
            }
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

      <MapModal
        ref={mapModalRef}
        onSelectLocation={onUserSelectLocation}
      />
      <CitiesModal
        ref={citiesModalRef}
        onSelectCity={onSelectCity}
        selectedCity={selectedCity}
      />

      {(isSubmitting || isLocationLoading) && <LoadingTransparent />}
    </Box>
  );
};

export default VendorApplication;

