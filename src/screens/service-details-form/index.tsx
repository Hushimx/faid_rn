import { Box } from 'common';
import {
  AppButton,
  AppHeader,
  AppKeyboardAwareScrollView,
  AppSpaceWrapper,
  AppSpacer,
  LoadingTransparent,
} from 'components';
import { useServiceDetailsFormController } from 'hooks';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapModal } from './components';
import StepIndicator from './components/step-indicator';
import Step1Media from './components/step-1-media';
import Step2Details from './components/step-2-details';
import Step3PricingLocation from './components/step-3-pricing-location';
import Step4Faq from './components/step-4-faq';

const ServiceDetailsForm = () => {
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
    isAddServiceLoading,
    onUploadServicePress,
  } = useServiceDetailsFormController();
  const { values, errors, touched } = formik;

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const stepTitles = [
    t('media'),
    t('details'),
    t('pricingLocation'),
    t('faq'),
  ];

  const scrollViewRef = useRef<any>(null);

  const validateCurrentStep = async () => {
    // Validate specific fields for each step
    const stepFields = {
      1: ['serviceMedia'], // Media step
      2: ['serviceTitleAr', 'category_id', 'serviceDescriptionAr'], // Details step
      3: ['fullLocationAr', 'fullLocation'], // Pricing & Location step
      4: [], // FAQ step is optional
    };

    const fieldsToValidate = stepFields[currentStep as keyof typeof stepFields] || [];
    
    if (fieldsToValidate.length === 0) {
      return true; // Step 4 is optional
    }

    // Validate only the fields for current step
    for (const field of fieldsToValidate) {
      try {
        await formik.validateField(field);
      } catch {
        // Field validation will set errors in formik
      }
    }

    // Check if any of the step fields have errors
    const hasErrors = fieldsToValidate.some(field => {
      return errors[field as keyof typeof errors];
    });

    return !hasErrors;
  };

  const handleNext = async () => {
    // Mark fields as touched to show errors
    const fieldsToTouch = {
      1: ['serviceMedia'],
      2: ['serviceTitleAr', 'category_id', 'serviceDescriptionAr'],
      3: ['fullLocationAr', 'fullLocation'],
      4: [],
    };

    fieldsToTouch[currentStep as keyof typeof fieldsToTouch]?.forEach(field => {
      formik.setFieldTouched(field, true);
    });

    // Validate current step
    const isValid = await validateCurrentStep();
    
    if (!isValid) {
      return; // Don't proceed if validation fails
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleSubmit = async () => {
    // Mark fields as touched to show errors
    const fieldsToTouch = {
      1: ['serviceMedia'],
      2: ['serviceTitleAr', 'category_id', 'serviceDescriptionAr'],
      3: ['fullLocationAr', 'fullLocation'],
      4: [],
    };

    fieldsToTouch[currentStep as keyof typeof fieldsToTouch]?.forEach(field => {
      formik.setFieldTouched(field, true);
    });

    // Validate current step
    const isValid = await validateCurrentStep();
    
    if (!isValid) {
      return; // Don't submit if validation fails
    }

    onUploadServicePress();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Media
            serviceMedia={values.serviceMedia}
            onUploadServiceMedia={onUploadServiceMedia}
            onDeleteServiceImage={onDeleteServiceImage}
            errors={errors}
            touched={touched}
          />
        );
      case 2:
        return (
          <Step2Details
            values={values}
            errors={errors}
            touched={touched}
            categories={categories}
            onCategorySelect={(value) => formik.setFieldValue('category_id', value)}
            onTitleChange={(value) => formik.setFieldValue('serviceTitleAr', value)}
            onTitleEnChange={(value) => formik.setFieldValue('serviceTitleEn', value)}
            onDescriptionChange={(value) => formik.setFieldValue('serviceDescriptionAr', value)}
            onDescriptionEnChange={(value) => formik.setFieldValue('serviceDescriptionEn', value)}
          />
        );
      case 3:
        return (
          <Step3PricingLocation
            values={values}
            errors={errors}
            touched={touched}
            onCostChange={(value) => formik.setFieldValue('serviceCost', value)}
            onPriceTypeChange={(value) => formik.setFieldValue('serviceType', value)}
            onLocationChange={(value) => formik.setFieldValue('fullLocation', value)}
            onLocationArChange={(value) => formik.setFieldValue('fullLocationAr', value)}
            onLocationEnChange={(value) => formik.setFieldValue('fullLocationEn', value)}
            onSelectLocation={() => mapModalRef.current?.openModal()}
            isLocationLoading={isLocationLoading}
          />
        );
      case 4:
        return (
          <Step4Faq
            faqs={values.faqs}
            onAddFaq={onAddFaq}
            onDeleteFaq={onDeleteFaq}
            onUpdateFaqQuestion={(index, value, lang) => onUpdateFaqQuestion(index, value, lang)}
            onUpdateFaqAnswer={(index, value, lang) => onUpdateFaqAnswer(index, value, lang)}
            errors={errors}
            touched={touched}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppHeader label={t('serviceInfoEnterance')} />
      <AppKeyboardAwareScrollView ref={scrollViewRef}>
        <AppSpaceWrapper>
          <AppSpacer variant="m" />

          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            steps={stepTitles}
          />

          <AppSpacer variant="m" />

          {renderCurrentStep()}

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
        <Box flexDirection="row" justifyContent="space-between">
          {currentStep > 1 && (
            <Box flex={1} marginRight="s">
              <AppButton
                label={t('previous')}
                isOutLined
                onPress={handlePrevious}
                isFullWidth
              />
            </Box>
          )}

          <Box flex={currentStep > 1 ? 1 : 1}>
        <AppButton
              label={currentStep === totalSteps ? t('publishTheAd') : t('next')}
              onPress={currentStep === totalSteps ? handleSubmit : handleNext}
              isFullWidth
              isLoading={isAddServiceLoading}
            />
          </Box>
        </Box>
      </Box>

      {isAddServiceLoading && <LoadingTransparent />}
    </Box>
  );
};

export default ServiceDetailsForm;
