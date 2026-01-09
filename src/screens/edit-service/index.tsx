import { Box, useAppTheme } from 'common';
import {
  AppButton,
  AppErrorMessage,
  AppHeader,
  AppInput,
  AppKeyboardAwareScrollView,
  AppPresseble,
  AppRadioBtn,
  AppShadowContainer,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  AppTextArea,
  AppSwitch,
  LoadingTransparent,
  LocationPin,
  Trash,
  UplaodBox,
} from 'components';
import { useEditServiceController } from 'hooks';
import { Fragment, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';
import { View, ActivityIndicator } from 'react-native';
import { PRICE_TYPE_ENUM, RootStackParamList } from 'types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppDropdown, MapModal, FaqItem } from '../service-details-form/components';
import ServiceImagesList from '../service-details-form/components/service-images-list';

const RiyalAccessory = ({ text }: { text: string }) => (
  <AppText>{text}</AppText>
);

// Helper function to convert Arabic numerals to English
const convertArabicToEnglish = (text: string): string => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let result = text;
  arabicNumbers.forEach((arabic, index) => {
    result = result.replace(new RegExp(arabic, 'g'), englishNumbers[index]);
  });
  return result;
};

// Helper function to convert English numerals to Arabic
const convertEnglishToArabic = (text: string): string => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let result = text;
  englishNumbers.forEach((english, index) => {
    result = result.replace(new RegExp(english, 'g'), arabicNumbers[index]);
  });
  return result;
};

const EditService = (
  props: NativeStackScreenProps<RootStackParamList, 'EditService'>,
) => {
  const { serviceId } = props.route.params;
  const { t } = useTranslation();
  const {
    formik,
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
    isUpdateServiceLoading,
    isServiceLoading,
  } = useEditServiceController(serviceId);
  const { values, errors, touched, handleSubmit } = formik;
  const {
    serviceMedia,
    serviceType,
    category_id,
    fullLocation,
    fullLocationAr,
    fullLocationEn,
  } = values;
  
  // Get display address based on current language
  const currentLang = i18n.language || 'ar';
  const displayAddress = currentLang === 'ar' ? (fullLocationAr || fullLocation) : (fullLocationEn || fullLocation);
  const { colors } = useAppTheme();

  const [showTitleEn, setShowTitleEn] = useState(false);
  const [showDescriptionEn, setShowDescriptionEn] = useState(false);
  const [isPriceEnabled, setIsPriceEnabled] = useState(
    serviceType === PRICE_TYPE_ENUM.fixed
  );

  // Sync toggle state when serviceType changes
  useEffect(() => {
    if (serviceType === PRICE_TYPE_ENUM.fixed) {
      setIsPriceEnabled(true);
    } else {
      setIsPriceEnabled(false);
    }
  }, [serviceType]);

  const handlePriceToggle = (enabled: boolean) => {
    setIsPriceEnabled(enabled);
    if (enabled) {
      formik.setFieldValue('serviceType', PRICE_TYPE_ENUM.fixed);
    } else {
      formik.setFieldValue('serviceType', PRICE_TYPE_ENUM.unspecified);
      formik.setFieldValue('serviceCost', '');
    }
  };

  const handlePriceChange = (text: string) => {
    // Convert Arabic numbers to English for storage
    const englishText = convertArabicToEnglish(text);
    // Only allow numbers and decimal point
    const cleaned = englishText.replace(/[^0-9.]/g, '');
    formik.setFieldValue('serviceCost', cleaned);
  };

  // Display value: convert to Arabic if current language is Arabic
  const displayPrice = currentLang === 'ar' && values.serviceCost
    ? convertEnglishToArabic(values.serviceCost)
    : values.serviceCost;

  // Show English fields if they have values
  useEffect(() => {
    if (values.serviceTitleEn) {
      setShowTitleEn(true);
    }
    if (values.serviceDescriptionEn) {
      setShowDescriptionEn(true);
    }
  }, [values.serviceTitleEn, values.serviceDescriptionEn]);

  // Refs for scrollView and field containers
  const scrollViewRef = useRef<any>(null);
  const serviceMediaRef = useRef<View>(null);
  const serviceTitleArRef = useRef<View>(null);
  const serviceTitleEnRef = useRef<View>(null);
  const categoryIdRef = useRef<View>(null);
  const serviceDescriptionArRef = useRef<View>(null);
  const serviceDescriptionEnRef = useRef<View>(null);
  const serviceCostRef = useRef<View>(null);
  const fullLocationRef = useRef<View>(null);

  // Scroll to first error function
  const scrollToFirstError = () => {
    const fieldOrder = [
      { key: 'serviceMedia', ref: serviceMediaRef },
      { key: 'serviceTitleAr', ref: serviceTitleArRef },
      { key: 'serviceTitleEn', ref: serviceTitleEnRef },
      { key: 'category_id', ref: categoryIdRef },
      { key: 'serviceDescriptionAr', ref: serviceDescriptionArRef },
      { key: 'serviceDescriptionEn', ref: serviceDescriptionEnRef },
      { key: 'serviceCost', ref: serviceCostRef },
      { key: 'fullLocation', ref: fullLocationRef },
    ];

    // Find first field with error
    for (const field of fieldOrder) {
      if (errors[field.key as keyof typeof errors]) {
        // Use setTimeout to ensure the ref is measured after render and state updates
        setTimeout(() => {
          if (field.ref.current && scrollViewRef.current) {
            // Try measureLayout first (more accurate)
            field.ref.current.measureLayout(
              scrollViewRef.current as any,
              (_x, y, _width, _height) => {
                if (scrollViewRef.current && y >= 0) {
                  scrollViewRef.current.scrollTo({
                    y: Math.max(0, y - 100),
                    animated: true,
                  });
                }
              },
              () => {
                // Fallback: use measureInWindow to calculate relative position
                if (field.ref.current && scrollViewRef.current) {
                  try {
                    field.ref.current.measureInWindow((_fieldX, fieldY, _fieldWidth, _fieldHeight) => {
                      if (scrollViewRef.current?.measureInWindow) {
                        scrollViewRef.current.measureInWindow((_scrollX: number, scrollY: number, _scrollWidth: number, _scrollHeight: number) => {
                          const relativeY = fieldY - scrollY;
                          if (relativeY >= 0) {
                            scrollViewRef.current?.scrollTo({
                              y: Math.max(0, relativeY - 100),
                              animated: true,
                            });
                          }
                        });
                      } else {
                        // Final fallback: use measure (page coordinates)
                        if (field.ref.current) {
                          field.ref.current.measure((_x, _y, _width, _height, _pageX, pageY) => {
                            if (scrollViewRef.current && pageY > 0) {
                              scrollViewRef.current.scrollTo({
                                y: Math.max(0, pageY - 200),
                                animated: true,
                              });
                            }
                          });
                        }
                      }
                    });
                  } catch {
                    // Final fallback: use measure (page coordinates)
                    if (field.ref.current) {
                      field.ref.current.measure((_x, _y, _width, _height, _pageX, pageY) => {
                        if (scrollViewRef.current && pageY > 0) {
                          scrollViewRef.current.scrollTo({
                            y: Math.max(0, pageY - 200),
                            animated: true,
                          });
                        }
                      });
                    }
                  }
                }
              }
            );
          }
        }, 200);
        break;
      }
    }
  };

  // Custom handleSubmit that scrolls to first error
  const handleSubmitWithScroll = async () => {
    const validationErrors = await formik.validateForm();
    if (Object.keys(validationErrors).length > 0) {
      // Set all fields as touched to show errors
      Object.keys(validationErrors).forEach(key => {
        formik.setFieldTouched(key, true);
      });
      // Wait a bit for state updates, then scroll to first error
      setTimeout(() => {
        scrollToFirstError();
      }, 100);
    } else {
      handleSubmit();
    }
  };

  if (isServiceLoading) {
    return (
      <Box flex={1} backgroundColor="pageBackground" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={colors.primary} />
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppHeader label={t('serviceInfoEnterance')} />
      <AppKeyboardAwareScrollView ref={scrollViewRef}>
        <AppSpaceWrapper>
          <AppSpacer variant="m" />

          {/* Service Media Section */}
          <View ref={serviceMediaRef}>
            <AppShadowContainer
              backgroundColor="white"
              borderRadius={16}
              style={{ padding: 16 }}
            >
            <AppText variant="h5" fontWeight={'700'} marginBottom="s">
              {t('serviceMedia')}
            </AppText>

            {!serviceMedia?.length && (
              <Fragment>
                <UplaodBox
                  title={t('uploadCleanImages')}
                  subTitle={t('maxUploadSizeForImage')}
                  onPress={onUploadServiceMedia}
                  isError={!!errors.serviceMedia && !!touched?.serviceMedia}
                />
                <AppSpacer variant="s" />
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
            </AppShadowContainer>
          </View>

          <AppSpacer variant="m" />

          {/* Service Details Section */}
          <AppShadowContainer
            backgroundColor="white"
            borderRadius={16}
            style={{ padding: 16 }}
          >
            <AppText variant="h5" fontWeight={'700'} marginBottom="s">
              {t('serviceDetails')}
            </AppText>

            <AppSpacer variant="m" />
            <View ref={serviceTitleArRef}>
            <AppInput
              label={t('serviceTitleAr')}
              placeholder={t('enterServiceTitle')}
              value={values.serviceTitleAr}
              onChangeText={formik.handleChange('serviceTitleAr')}
              touched={touched.serviceTitleAr}
              caption={errors.serviceTitleAr}
            />
            </View>

            <AppSpacer variant="m" />
            <View ref={serviceTitleEnRef}>
            {showTitleEn ? (
              <Box>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  marginBottom="ss"
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
            </View>

            <AppSpacer variant="m" />
            <View ref={categoryIdRef}>
              <AppDropdown
                data={categories?.map(item => ({
                  label: item?.name,
                  value: item?.id,
                }))}
                onSelect={selectedCategoryId => {
                  formik.setFieldValue('category_id', selectedCategoryId);
                }}
                value={category_id}
                placeholder={t('selectCategory')}
                label={t('category')}
                error={errors?.category_id}
                touched={touched?.category_id}
              />
            </View>

            <AppSpacer variant="m" />
            <View ref={serviceDescriptionArRef}>
            <AppTextArea
              label={t('serviceDescriptionAr')}
              placeholder={t('enterServiceDescription')}
              value={values.serviceDescriptionAr}
              onChangeText={formik.handleChange('serviceDescriptionAr')}
              touched={touched.serviceDescriptionAr}
              caption={errors.serviceDescriptionAr}
            />
            </View>

            <AppSpacer variant="m" />
            <View ref={serviceDescriptionEnRef}>
            {showDescriptionEn ? (
              <Box>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  marginBottom="ss"
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
            </View>

            <AppSpacer variant="m" />
            <View ref={serviceCostRef}>
              <Box marginBottom="m">
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  marginBottom="s"
                >
                  <AppText variant="s1" color="grayDark">
                    {t('serviceCost')}
                  </AppText>
                  <AppSwitch
                    isEnabled={isPriceEnabled}
                    toggleSwitch={() => handlePriceToggle(!isPriceEnabled)}
                  />
                </Box>
                {isPriceEnabled && (
                  <AppInput
                    placeholder={t('enterServiceCost')}
                    accessoryRight={() => <RiyalAccessory text={t('riyal')} />}
                    value={displayPrice}
                    onChangeText={handlePriceChange}
                    touched={touched.serviceCost}
                    caption={errors.serviceCost}
                    keyboardType="numeric"
                  />
                )}
              </Box>
            </View>
          </AppShadowContainer>

          <AppSpacer variant="m" />

          {/* Location Section */}
          <AppShadowContainer
            backgroundColor="white"
            borderRadius={16}
            style={{ padding: 16 }}
          >
            <AppText variant="h5" fontWeight={'700'} marginBottom="m">
              {t('location')}
            </AppText>

            <View ref={fullLocationRef}>
            <AppTextArea
              label={t('fullLocation')}
              placeholder={t('enterFullLocation')}
              value={displayAddress}
              onChangeText={formik.handleChange('fullLocation')}
              touched={touched.fullLocation}
              caption={errors.fullLocation}
                editable={false}
            />
            </View>
            <AppSpacer variant="m" />
            <AppButton
              label={t('selectLocationOnMap')}
              isOutLined
              onPress={() => mapModalRef.current?.openModal()}
              isFullWidth
              isLoading={isLocationLoading}
              loadingStatus={'primary'}
              icon={
                <Box marginRight="s">
                  <LocationPin size={20} color={colors.primary} />
                </Box>
              }
            />
          </AppShadowContainer>

          <AppSpacer variant="m" />

          {/* FAQ Section */}
          <AppShadowContainer
            backgroundColor="white"
            borderRadius={16}
            style={{ padding: 16 }}
          >
            <AppText variant="h5" fontWeight={'700'} marginBottom="s">
              {t('optionalFaq')}
            </AppText>

            {values.faqs.map((faq, index) => (
              <Box key={index} marginBottom="m">
                <FaqItem
                  index={index}
                  faq={faq}
                  errors={errors?.faqs?.[index]}
                  touched={touched?.faqs?.[index]}
                  onDelete={onDeleteFaq}
                  onUpdateQuestion={onUpdateFaqQuestion}
                  onUpdateAnswer={onUpdateFaqAnswer}
                />
              </Box>
            ))}

            <AppButton
              isFullWidth
              isOutLined
              label={t('addNewQuestions')}
              onPress={onAddFaq}
            />
          </AppShadowContainer>

          <AppSpacer variant="xxl" />
        </AppSpaceWrapper>
      </AppKeyboardAwareScrollView>

      <MapModal 
        ref={mapModalRef} 
        onSelectLocation={onUserSelectLocation}
        initialLocation={values.lat && values.lng ? { latitude: values.lat, longitude: values.lng } : null}
      />
      <Box
        position="absolute"
        bottom={0}
        width={'100%'}
        paddingHorizontal="m"
        paddingBottom="m"
        backgroundColor="pageBackground"
        paddingTop="s"
      >
        <AppButton
          label={isUpdateServiceLoading ? t('saving') || 'Saving...' : t('saveChanges')}
          onPress={handleSubmitWithScroll}
          disabled={isUpdateServiceLoading}
        />
      </Box>
      {isUpdateServiceLoading && <LoadingTransparent />}
    </Box>
  );
};

export default EditService;

