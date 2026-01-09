import { useFormik } from 'formik';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { Asset } from 'react-native-image-picker';
import { LatLng } from 'react-native-maps';
import {
  ICategory,
  IModalRef,
  IServiceResponse,
  PRICE_TYPE_ENUM,
  QUERIES_KEY_ENUM,
} from 'types';
import {
  createServiceScheme,
  dataExtractor,
  imageVideoPicker,
  reverseGeocode,
  ShowSnackBar,
} from 'utils';
import { HomeApis, ServicesApis } from 'services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useAuthStore } from 'store';
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const newFaq = {
  questionEn: '',
  questionAr: '',
  answerEn: '',
  answerAr: '',
};
export interface ServiceDetailsFormValues {
  // fullName: string;
  // brief: string;
  serviceTitleEn: string;
  serviceTitleAr: string;
  serviceDescriptionEn: string;
  serviceDescriptionAr: string;
  serviceCost: string;
  // servicePeriod: string;
  fullLocation: string;
  fullLocationAr: string;
  fullLocationEn: string;
  locationLink: string;
  faqs: {
    questionEn: string;
    questionAr: string;
    answerEn: string;
    answerAr: string;
  }[];
  currentQuestion: string;
  currentAnswer: string;
  serviceMedia: Asset[];

  serviceType: PRICE_TYPE_ENUM;
  lat: number;
  lng: number;
  category_id: number | null;
  // status: SERVICE_STATUS_ENUM | null;
  city: string | null;
  cityAr: string | null;
  cityEn: string | null;
}

const useServiceDetailsFormController = () => {
  const { t } = useTranslation();
  const navigation: any = useNavigation();
  const { user } = useAuthStore();
  const mapModalRef = useRef<IModalRef>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const { mutateAsync: AddServiceMutation, isPending: isAddServiceLoading } =
    useMutation({
      mutationFn: (data: FormData) => ServicesApis.addService(data),
    });

  const validationSchema = createServiceScheme(t);

  const formik = useFormik<ServiceDetailsFormValues>({
    initialValues: {
      // fullName: '',
      // brief: '',
      serviceTitleEn: '',
      serviceTitleAr: '',
      serviceDescriptionEn: '',
      serviceDescriptionAr: '',
      serviceCost: '',
      // servicePeriod: '',
      fullLocation: '',
      fullLocationAr: '',
      fullLocationEn: '',
      locationLink: '',
      faqs: [newFaq],
      currentQuestion: '',
      currentAnswer: '',
      serviceMedia: [],
      serviceType: PRICE_TYPE_ENUM?.unspecified,
      lat: 0,
      lng: 0,
      category_id: null,
      // status: null,
      city: null,
      cityAr: null,
      cityEn: null,
    },
    validationSchema,
    validateOnChange: true,
    onSubmit: () => onUploadServicePress(),
  });
  const { values } = formik;
  const { serviceMedia, category_id } = formik.values;
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryFn: () => HomeApis.getCategories(),
    queryKey: [QUERIES_KEY_ENUM.categories],
  });

  const onUploadServiceMedia = async () => {
    try {
      const res = await imageVideoPicker({
        selectionLimit:
          serviceMedia?.length === 0 ? 5 : 5 - serviceMedia?.length,
      });
      if (res?.assets?.length) {
        formik.setFieldValue('serviceMedia', [
          ...formik.values.serviceMedia,
          ...res?.assets,
        ]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onDeleteServiceImage = (imageIndex: number) => {
    let updatedMedia = [...formik.values.serviceMedia];
    updatedMedia = updatedMedia.filter((item, index) => index !== imageIndex);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    formik.setFieldValue('serviceMedia', updatedMedia);
  };

  const onAddFaq = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    formik.setFieldValue('faqs', [...formik.values.faqs, newFaq]);
  };

  const onDeleteFaq = (faqIndex: number) => {
    const updatedFaqs = formik.values.faqs.filter(
      (item, index) => index !== faqIndex,
    );
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    formik.setFieldValue('faqs', updatedFaqs);
  };

  const onUpdateFaqQuestion = (
    index: number,
    value: string,
    lang: 'en' | 'ar',
  ) => {
    const updatedFaqs = [...formik.values.faqs];
    if (lang === 'en') {
      updatedFaqs[index].questionEn = value;
    } else {
      updatedFaqs[index].questionAr = value;
    }
    formik.setFieldValue('faqs', updatedFaqs);
  };

  const onUpdateFaqAnswer = (
    index: number,
    value: string,
    lang: 'en' | 'ar',
  ) => {
    const updatedFaqs = [...formik.values.faqs];
    if (lang === 'en') {
      updatedFaqs[index].answerEn = value;
    } else {
      updatedFaqs[index].answerAr = value;
    }
    formik.setFieldValue('faqs', updatedFaqs);
  };

  const onUserSelectLocation = async (location: LatLng) => {
    const { latitude, longitude } = location;

    try {
      setIsLocationLoading(true);
      const res = await reverseGeocode(latitude, longitude);
      if (res) {
        const currentLang = i18n.language || 'ar';
        const displayAddress = currentLang === 'ar' ? res.display_name_ar : res.display_name_en;
        formik.setFieldValue('fullLocation', displayAddress);
        formik.setFieldValue('fullLocationAr', res.display_name_ar);
        formik.setFieldValue('fullLocationEn', res.display_name_en);
      formik.setFieldValue('lat', latitude);
      formik.setFieldValue('lng', longitude);
        formik.setFieldValue('cityAr', res?.address?.city_ar || '');
        formik.setFieldValue('cityEn', res?.address?.city_en || '');
        formik.setFieldValue('city', currentLang === 'ar' ? res?.address?.city_ar : res?.address?.city_en);
      }
    } catch (e) {
      console.log('Error getting address:', e);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const onUploadServicePress = async () => {
    // Additional validation checks (formik validation already done in handleSubmitWithScroll)
    // Ensure category_id is selected
    if (!category_id) {
      formik.setFieldTouched('category_id', true);
      ShowSnackBar({
        text: t('errors.fieldRequired') || 'Please select a category',
        type: 'error',
      });
      return;
    }

    // Ensure cityAr is set (required by backend)
    if (!values.cityAr || values.cityAr.trim() === '') {
      ShowSnackBar({
        text: t('errors.fieldRequired') || 'Please select a location',
        type: 'error',
      });
      return;
    }

    const formData = new FormData();
    formData.append('category_id', category_id.toString());
    formData.append('title[en]', values.serviceTitleEn);
    formData.append('title[ar]', values.serviceTitleAr);
    formData.append('description[en]', values.serviceDescriptionEn);
    formData.append('description[ar]', values.serviceDescriptionAr);
    formData.append('price_type', values.serviceType);
    // Only send price if not unspecified
    if (values.serviceType !== PRICE_TYPE_ENUM.unspecified && values.serviceCost) {
      formData.append('price', values.serviceCost);
    }
    formData.append('lat', values.lat.toString());
    formData.append('lng', values.lng.toString());
    // formData.append('status', values?.status);
    if (values.fullLocationAr) {
      formData.append('address[ar]', values.fullLocationAr);
    }
    if (values.fullLocationEn) {
      formData.append('address[en]', values.fullLocationEn);
    }
    if (values.cityAr) {
      formData.append('city[ar]', values.cityAr);
    }
    if (values.cityEn) {
      formData.append('city[en]', values.cityEn);
    }
    values.faqs.forEach((item, index) => {
      if (
        item.questionEn ||
        item.questionAr ||
        item.answerEn ||
        item.answerAr
      ) {
        formData.append(`faqs[${index}][question][en]`, item.questionEn);
        formData.append(`faqs[${index}][question][ar]`, item.questionAr);
        formData.append(`faqs[${index}][answer][en]`, item.answerEn);
        formData.append(`faqs[${index}][answer][ar]`, item.answerAr);
      }
    });
    serviceMedia.forEach((item, index) => {
      formData.append(`media[${index}][file]`, {
        uri: item.uri,
        type: item.type,
        name: item.fileName,
      });
      formData.append(
        `media[${index}][type]`,
        item.type?.includes('image') ? 'image' : 'video',
      );
      // Mark the first image as primary
      if (index === 0) {
        formData.append(`media[${index}][is_primary]`, '1');
      }
    });

    try {
      const res = await AddServiceMutation(formData);
      const data = dataExtractor<IServiceResponse>(res);
      const serviceId = data?.id;
      
      ShowSnackBar({
        text: t('serviceCreatedSuccessfully') || 'Service created successfully',
      });
      
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'BottomTab' },
            { name: 'ServiceDetails', params: { serviceId } },
          ],
        } as any),
      );
      // Invalidate query to refresh the list
      queryClient.invalidateQueries({
        queryKey: [QUERIES_KEY_ENUM.vendor_services, user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERIES_KEY_ENUM.services],
      });
    } catch (error: any) {
      console.error('Service creation error:', error);
      const errorMessage = 
        error?.response?.data?.message || 
        error?.response?.data?.error ||
        error?.message ||
        t('errors.failedToCreateService') || 
        'Failed to create service. Please try again.';
      
      ShowSnackBar({
        text: errorMessage,
        type: 'error',
      });
    }
  };

  return {
    formik,
    onUploadServiceMedia,
    onDeleteServiceImage,
    onAddFaq,
    onDeleteFaq,
    onUpdateFaqQuestion,
    onUpdateFaqAnswer,
    mapModalRef,
    onUserSelectLocation,
    categories: dataExtractor(categories) as ICategory[],
    isLocationLoading,
    isAddServiceLoading,
    onUploadServicePress,
  };
};

export default useServiceDetailsFormController;
