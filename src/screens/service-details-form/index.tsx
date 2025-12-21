import { Box, useAppTheme } from 'common';
import {
  AppButton,
  AppErrorMessage,
  AppHeader,
  AppInput,
  AppKeyboardAwareScrollView,
  AppPresseble,
  AppRadioBtn,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  AppTextArea,
  LoadingTransparent,
  LocationPin,
  Trash,
  UplaodBox,
} from 'components';
import { useServiceDetailsFormController } from 'hooks';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { PRICE_TYPE_ENUM } from 'types';
import { AppDropdown, MapModal, FaqItem } from './components';
import ServiceImagesList from './components/service-images-list';

const ServiceDetailsForm = () => {
  const { t } = useTranslation();
  const {
    formik,
    onUploadProfilePicture,
    onUploadServiceMedia,
    onDeleteServiceImage,
    onAddFaq,
    onDeleteFaq,
    onUpdateFaqQuestion,
    onUpdateFaqAnswer,
    mapModalRef,
    onUserSelectLocation,
    categories,
    isLocationLoading,
    isAddServiceLoading,
  } = useServiceDetailsFormController();
  const { values, errors, touched, handleSubmit } = formik;
  const {
    profilePicture,
    serviceMedia,
    serviceType,
    category_id,
    fullLocation,
  } = values;
  const { colors } = useAppTheme();

  const [showTitleEn, setShowTitleEn] = useState(false);
  const [showDescriptionEn, setShowDescriptionEn] = useState(false);

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppHeader label={t('serviceInfoEnterance')} />
      <AppKeyboardAwareScrollView>
        <AppSpaceWrapper>
          <AppSpacer variant="ml" />

          <AppText fontWeight={'700'}>{t('serviceDetails')}</AppText>
          <AppSpacer variant="s" />

          <AppText color="grayDark" variant="s1">
            {t('profilePic')}
          </AppText>

          <AppSpacer variant="ss" />
          <UplaodBox
            title={t('uplaodImage')}
            subTitle={t('maxUploadSize')}
            onPress={onUploadProfilePicture}
            image={
              profilePicture?.uri ? { uri: profilePicture?.uri } : undefined
            }
            isError={!!touched?.profilePicture && !!errors?.profilePicture}
          />
          <AppErrorMessage
            text={errors?.profilePicture!}
            isError={!!touched?.profilePicture && !!errors?.profilePicture}
          />

          <AppSpacer variant="sm" />
          <AppDropdown
            data={categories?.map(item => ({
              label: item?.name,
              value: item?.id,
            }))}
            onSelect={category_id => {
              formik.setFieldValue('category_id', category_id);
            }}
            value={category_id}
            placeholder={t('selectCategory')}
            label={t('category')}
            error={errors?.category_id}
            touched={touched?.category_id}
          />

          <AppSpacer variant="s" />

          <AppInput
            label={t('serviceTitleAr')}
            placeholder={t('enterServiceTitle')}
            value={values.serviceTitleAr}
            onChangeText={formik.handleChange('serviceTitleAr')}
            touched={touched.serviceTitleAr}
            caption={errors.serviceTitleAr}
          />
          <AppSpacer variant="s" />

          {showTitleEn ? (
            <Box>
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <AppText color="grayDark" variant="s2">
                  {t('serviceTitleEn')}
                </AppText>
                <AppPresseble
                  onPress={() => {
                    setShowTitleEn(false);
                    formik.setFieldValue('serviceTitleEn', '');
                  }}
                >
                  <Trash size={18} />
                </AppPresseble>
              </Box>
              <AppSpacer variant="ss" />
              <AppInput
                placeholder={t('enterServiceTitle')}
                value={values.serviceTitleEn}
                onChangeText={formik.handleChange('serviceTitleEn')}
                touched={touched.serviceTitleEn}
                caption={errors.serviceTitleEn}
              />
            </Box>
          ) : (
            <AppPresseble onPress={() => setShowTitleEn(true)}>
              <AppText color="primary" variant="s1">
                + {t('addEnglishTitle')}
              </AppText>
            </AppPresseble>
          )}

          <AppSpacer variant="s" />

          <AppTextArea
            label={t('serviceDescriptionAr')}
            placeholder={t('enterServiceDescription')}
            value={values.serviceDescriptionAr}
            onChangeText={formik.handleChange('serviceDescriptionAr')}
            touched={touched.serviceDescriptionAr}
            caption={errors.serviceDescriptionAr}
          />

          <AppSpacer variant="s" />

          {showDescriptionEn ? (
            <Box>
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <AppText color="grayDark" variant="s2">
                  {t('serviceDescriptionEn')}
                </AppText>
                <AppPresseble
                  onPress={() => {
                    setShowDescriptionEn(false);
                    formik.setFieldValue('serviceDescriptionEn', '');
                  }}
                >
                  <Trash size={18} />
                </AppPresseble>
              </Box>
              <AppSpacer variant="ss" />
              <AppTextArea
                placeholder={t('enterServiceDescription')}
                value={values.serviceDescriptionEn}
                onChangeText={formik.handleChange('serviceDescriptionEn')}
                touched={touched.serviceDescriptionEn}
                caption={errors.serviceDescriptionEn}
              />
            </Box>
          ) : (
            <AppPresseble onPress={() => setShowDescriptionEn(true)}>
              <AppText color="primary" variant="s1">
                + {t('addEnglishDescription')}
              </AppText>
            </AppPresseble>
          )}

          <AppSpacer variant="s" />
          <AppInput
            label={t('serviceCost')}
            placeholder={t('enterServiceCost')}
            accessoryRight={() => <AppText>{t('riyal')}</AppText>}
            value={values.serviceCost}
            onChangeText={formik.handleChange('serviceCost')}
            touched={touched.serviceCost}
            caption={errors.serviceCost}
            keyboardType="numeric"
          />
          <AppSpacer variant="ss" />
          <Box flexDirection="row" alignItems="center">
            <AppRadioBtn
              text={t('fixed')}
              checked={serviceType === PRICE_TYPE_ENUM.fixed}
              onChange={() =>
                formik.setFieldValue('serviceType', PRICE_TYPE_ENUM.fixed)
              }
            />
            <AppRadioBtn
              text={t('negotiable')}
              checked={serviceType === PRICE_TYPE_ENUM.negotiable}
              onChange={() =>
                formik.setFieldValue('serviceType', PRICE_TYPE_ENUM.negotiable)
              }
            />
          </Box>

          <AppSpacer variant="ml" />
          <AppText fontWeight={'700'}>{t('location')}</AppText>
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

          <AppSpacer variant="ml" />
          <AppText fontWeight={'700'}>{t('serviceMedia')}</AppText>
          <AppSpacer variant="ss" />

          {!serviceMedia?.length && (
            <Fragment>
              <UplaodBox
                title={t('uploadCleanImages')}
                subTitle={t('maxUploadSizeForImage')}
                onPress={onUploadServiceMedia}
                isError={!!errors.serviceMedia && !!touched?.serviceMedia}
              />
              <AppSpacer variant="ss" />
              <AppErrorMessage
                isError={!!errors.serviceMedia && !!touched?.serviceMedia}
                text={
                  typeof errors.serviceMedia === 'string'
                    ? errors.serviceMedia
                    : t('errors.fieldRequired')
                }
              />
            </Fragment>
          )}

          {!!serviceMedia?.length && (
            <ServiceImagesList
              serviceMedia={serviceMedia}
              onDeleteServiceImage={onDeleteServiceImage}
              onUploadServiceImages={onUploadServiceMedia}
            />
          )}

          <AppSpacer variant="ml" />
          <AppText fontWeight={'700'}>{t('optionalFaq')}</AppText>
          <AppSpacer variant="ss" />

          {values.faqs.map((faq, index) => (
            <FaqItem
              key={index}
              index={index}
              faq={faq}
              errors={errors?.faqs?.[index]}
              touched={touched?.faqs?.[index]}
              onDelete={onDeleteFaq}
              onUpdateQuestion={onUpdateFaqQuestion}
              onUpdateAnswer={onUpdateFaqAnswer}
            />
          ))}

          <AppButton
            style={{ width: '100%' }}
            isOutLined
            label={t('addNewQuestions')}
            onPress={onAddFaq}
          />
          <AppSpacer variant="xxl" />
        </AppSpaceWrapper>
      </AppKeyboardAwareScrollView>

      <MapModal ref={mapModalRef} onSelectLocation={onUserSelectLocation} />
      <Box position="absolute" bottom={5} width={'100%'}>
        <AppButton
          label={t('publishTheAd')}
          onPress={handleSubmit}
          // isLoading={isAddServiceLoading}
        />
      </Box>
      {isAddServiceLoading && <LoadingTransparent />}
    </Box>
  );
};

export default ServiceDetailsForm;

const styles = StyleSheet.create({});
