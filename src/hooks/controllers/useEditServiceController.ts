import { useFormik } from 'formik';
import { useRef, useState, useMemo } from 'react';
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
import { useNavigation } from '@react-navigation/native';
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
  serviceTitleEn: string;
  serviceTitleAr: string;
  serviceDescriptionEn: string;
  serviceDescriptionAr: string;
  serviceCost: string;
  fullLocation: string;
  fullLocationAr: string;
  fullLocationEn: string;
  locationLink: string;
  faqs: {
    id?: number;
    questionEn: string;
    questionAr: string;
    answerEn: string;
    answerAr: string;
  }[];
  currentQuestion: string;
  currentAnswer: string;
  serviceMedia: (Asset & { mediaId?: number })[];
  existingMediaIds: number[];

  serviceType: PRICE_TYPE_ENUM;
  lat: number;
  lng: number;
  category_id: number | null;
  city: string | null;
  cityAr: string | null;
  cityEn: string | null;
}

const useEditServiceController = (serviceId: number) => {
  const { t } = useTranslation();
  const navigation: any = useNavigation();
  const mapModalRef = useRef<IModalRef>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const { mutateAsync: UpdateServiceMutation, isPending: isUpdateServiceLoading } =
    useMutation({
      mutationFn: (data: FormData) => {
        console.log('Updating service with ID:', serviceId);
        return ServicesApis.updateService(serviceId, data);
      },
    });

  const validationSchema = createServiceScheme(t);

  // Fetch existing service data with media and faqs
  const { data: serviceData, isLoading: isServiceLoading } = useQuery({
    queryFn: async () => {
      console.log('Fetching service:', serviceId);
      const result = await ServicesApis.getService({ serviceId });
      console.log('Fetched service result:', result);
      return result;
    },
    queryKey: [QUERIES_KEY_ENUM.services, serviceId],
    enabled: !!serviceId,
  });

  const service = dataExtractor<IServiceResponse>(serviceData);

  // Compute initial values based on service data - memoized to update when service changes
  const initialValues = useMemo((): ServiceDetailsFormValues => {
    console.log('=== COMPUTING INITIAL VALUES ===');
    console.log('Service object:', service);
    console.log('Service ID:', service?.id);
    console.log('Service title:', service?.title);
    console.log('Service category:', (service as any)?.category);
    console.log('Service price_type:', service?.price_type);
    console.log('Service city:', service?.city);
    console.log('================================');
    
    if (!service) {
      console.log('No service data yet, returning defaults');
    
      return {
        serviceTitleEn: '',
        serviceTitleAr: '',
        serviceDescriptionEn: '',
        serviceDescriptionAr: '',
        serviceCost: '',
        fullLocation: '',
        fullLocationAr: '',
        fullLocationEn: '',
        locationLink: '',
        faqs: [newFaq],
        currentQuestion: '',
        currentAnswer: '',
        serviceMedia: [],
        existingMediaIds: [],
        serviceType: PRICE_TYPE_ENUM?.fixed,
        lat: 0,
        lng: 0,
        category_id: null,
        city: null,
        cityAr: null,
        cityEn: null,
      };
    }

    // Handle translatable fields - they come as objects with ar/en or as strings
    let title: { ar: string; en: string };
    if (!service.title) {
      title = { ar: '', en: '' };
    } else if (typeof service.title === 'string') {
      title = { ar: service.title, en: '' };
    } else if (typeof service.title === 'object' && service.title !== null) {
      title = {
        ar: (service.title as any).ar || '',
        en: (service.title as any).en || '',
      };
    } else {
      title = { ar: '', en: '' };
    }
    
    let description: { ar: string; en: string };
    if (!service.description) {
      description = { ar: '', en: '' };
    } else if (typeof service.description === 'string') {
      description = { ar: service.description, en: '' };
    } else if (typeof service.description === 'object' && service.description !== null) {
      description = {
        ar: (service.description as any).ar || '',
        en: (service.description as any).en || '',
      };
    } else {
      description = { ar: '', en: '' };
    }
    
    let address: { ar: string; en: string };
    if (!service.address) {
      address = { ar: '', en: '' };
    } else if (typeof service.address === 'string') {
      address = { ar: service.address, en: '' };
    } else if (typeof service.address === 'object' && service.address !== null) {
      address = {
        ar: (service.address as any).ar || '',
        en: (service.address as any).en || '',
      };
    } else {
      address = { ar: '', en: '' };
    }

    const currentLang = i18n.language || 'ar';
    const displayAddress = currentLang === 'ar' ? (address.ar || '') : (address.en || address.ar || '');

    // Handle city - it comes as a translatable field from the city relation
    let cityName: { ar: string; en: string };
    if (!service.city) {
      cityName = { ar: '', en: '' };
    } else if (typeof service.city === 'string') {
      cityName = { ar: service.city, en: service.city };
    } else if (typeof service.city === 'object' && service.city !== null) {
      cityName = {
        ar: (service.city as any).ar || '',
        en: (service.city as any).en || '',
      };
    } else {
      cityName = { ar: '', en: '' };
    }

    return {
      serviceTitleEn: title.en || '',
      serviceTitleAr: title.ar || '',
      serviceDescriptionEn: description.en || '',
      serviceDescriptionAr: description.ar || '',
      serviceCost: service.price?.toString() || '',
      fullLocation: displayAddress,
      fullLocationAr: address.ar || '',
      fullLocationEn: address.en || '',
      locationLink: '',
      faqs: service.faqs && service.faqs.length > 0
        ? service.faqs.map((faq: any) => {
            const faqQuestion = typeof faq.question === 'string'
              ? { ar: faq.question, en: '' }
              : (faq.question as any) || { ar: '', en: '' };
            const faqAnswer = typeof faq.answer === 'string'
              ? { ar: faq.answer, en: '' }
              : (faq.answer as any) || { ar: '', en: '' };
            return {
              id: faq.id,
              questionEn: faqQuestion.en || '',
              questionAr: faqQuestion.ar || '',
              answerEn: faqAnswer.en || '',
              answerAr: faqAnswer.ar || '',
            };
          })
        : [newFaq],
      currentQuestion: '',
      currentAnswer: '',
      serviceMedia: [
        ...(service.images || []).filter((img: any) => img && img.url).map((img: any) => ({
          uri: img.url,
          type: 'image/jpeg',
          fileName: img.id ? `existing_${img.id}.jpg` : 'existing.jpg',
          mediaId: img.id,
        })),
        ...(service.videos || []).filter((vid: any) => vid && vid.url).map((vid: any) => ({
          uri: vid.url,
          type: 'video/mp4',
          fileName: vid.id ? `existing_${vid.id}.mp4` : 'existing.mp4',
          mediaId: vid.id,
        })),
      ] as (Asset & { mediaId?: number })[],
      existingMediaIds: [
        ...(service.images || []).map((img: any) => img.id).filter((id: any) => id),
        ...(service.videos || []).map((vid: any) => vid.id).filter((id: any) => id),
      ],
      serviceType: (service.price_type as PRICE_TYPE_ENUM) || PRICE_TYPE_ENUM.fixed,
      lat: service.lat || 0,
      lng: service.lng || 0,
      category_id: (service as any).category?.id || null,
      city: currentLang === 'ar' ? (cityName.ar || '') : (cityName.en || cityName.ar || ''),
      cityAr: cityName.ar || '',
      cityEn: cityName.en || '',
    };
  }, [service]);

  const formik = useFormik<ServiceDetailsFormValues>({
    initialValues,
    validationSchema,
    validateOnChange: true,
    onSubmit: () => onUpdateServicePress(),
    enableReinitialize: true, // This will reinitialize when initialValues change
  });

  const { values } = formik;
  const { serviceMedia, category_id } = values;
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
    const itemToDelete = updatedMedia[imageIndex];
    
    // If it's an existing image (has mediaId), remove it from existingMediaIds
    if (itemToDelete && 'mediaId' in itemToDelete && itemToDelete.mediaId) {
      const updatedExistingIds = formik.values.existingMediaIds.filter(
        id => id !== itemToDelete.mediaId
      );
      formik.setFieldValue('existingMediaIds', updatedExistingIds);
    }
    
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

  const onUpdateServicePress = async () => {
    console.log('=== UPDATE SERVICE FORM SUBMISSION ===');
    console.log('All form values:', values);
    console.log('category_id from destructure:', category_id);
    console.log('category_id from values:', values.category_id);
    console.log('serviceTitleAr:', values.serviceTitleAr);
    console.log('serviceTitleEn:', values.serviceTitleEn);
    console.log('serviceType:', values.serviceType);
    console.log('======================================');

    const formData = new FormData();
    const categoryIdToSend = values.category_id || category_id;
    if (!categoryIdToSend) {
      console.error('Category ID is missing!');
      return;
    }
    formData.append('category_id', categoryIdToSend.toString());
    formData.append('title[ar]', values.serviceTitleAr || '');
    formData.append('title[en]', values.serviceTitleEn || '');
    formData.append('description[ar]', values.serviceDescriptionAr || '');
    formData.append('description[en]', values.serviceDescriptionEn || '');
    formData.append('price_type', values.serviceType || 'fixed');
    // Only send price if not unspecified
    if (values.serviceType !== PRICE_TYPE_ENUM.unspecified && values.serviceCost) {
      formData.append('price', values.serviceCost);
    }
    formData.append('lat', values.lat?.toString() || '0');
    formData.append('lng', values.lng?.toString() || '0');
    if (values.fullLocationAr) {
      formData.append('address[ar]', values.fullLocationAr);
    }
    if (values.fullLocationEn) {
      formData.append('address[en]', values.fullLocationEn);
    }
    if (values.cityAr) {
      formData.append('city[ar]', values.cityAr);
    } else {
      console.warn('cityAr is missing!');
    }
    if (values.cityEn) {
      formData.append('city[en]', values.cityEn);
    }
    
    // Always send list of media IDs to keep (existing media that wasn't deleted)
    // This is critical - even if empty, send it so backend knows which media to keep
    if (values.existingMediaIds && values.existingMediaIds.length > 0) {
      values.existingMediaIds.forEach((id) => {
        formData.append('keep_media_ids[]', id.toString());
      });
    } else {
      // Send empty array to indicate no media should be kept
      formData.append('keep_media_ids[]', '');
    }
    
    values.faqs.forEach((item, index) => {
      if (
        item.questionEn ||
        item.questionAr ||
        item.answerEn ||
        item.answerAr
      ) {
        if (item.id) {
          formData.append(`faqs[${index}][id]`, item.id.toString());
        }
        formData.append(`faqs[${index}][question][en]`, item.questionEn);
        formData.append(`faqs[${index}][question][ar]`, item.questionAr);
        formData.append(`faqs[${index}][answer][en]`, item.answerEn);
        formData.append(`faqs[${index}][answer][ar]`, item.answerAr);
      }
    });
    // Only send new media files (not existing ones - existing ones are tracked by keep_media_ids)
    let newMediaIndex = 0;
    serviceMedia.forEach((item) => {
      // Skip existing media (they have mediaId) - they're already on the server
      if ('mediaId' in item && item.mediaId) {
        return;
      }
      
      // Only send new files (local files)
      if (item.uri && !item.uri.startsWith('http')) {
        formData.append(`media[${newMediaIndex}][file]`, {
          uri: item.uri,
          type: item.type,
          name: item.fileName,
        } as any);
        formData.append(
          `media[${newMediaIndex}][type]`,
          item.type?.includes('image') ? 'image' : 'video',
        );
        if (newMediaIndex === 0 && values.existingMediaIds.length === 0) {
          formData.append(`media[${newMediaIndex}][is_primary]`, 1);
        }
        newMediaIndex++;
      }
    });

    try {
      console.log('Sending update request...');
      const res = await UpdateServiceMutation(formData);
      console.log('Update successful!', res);
      const data = dataExtractor<IServiceResponse>(res);
      const updatedServiceId = data?.id || serviceId;
      
      // Invalidate ALL service-related queries to refresh everything
      // 1. Invalidate the service details page query
      await queryClient.invalidateQueries({
        queryKey: [QUERIES_KEY_ENUM.service_details, updatedServiceId],
      });
      
      // 2. Invalidate the edit form service query
      await queryClient.invalidateQueries({
        queryKey: [QUERIES_KEY_ENUM.services, updatedServiceId],
      });
      
      // 3. Invalidate all service lists (vendor services, category services, etc.)
      await queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            queryKey.includes(QUERIES_KEY_ENUM.services) ||
            queryKey.includes(QUERIES_KEY_ENUM.vendor_services) ||
            queryKey.includes(QUERIES_KEY_ENUM.show_all_service_list) ||
            queryKey.includes(QUERIES_KEY_ENUM.service_details)
          );
        },
      });
      
      // 4. Refetch the service details to ensure fresh data before navigation
      await queryClient.refetchQueries({
        queryKey: [QUERIES_KEY_ENUM.service_details, updatedServiceId],
      });
      
      // Show success message
      ShowSnackBar({
        text: t('serviceUpdatedSuccessfully') || 'Service updated successfully',
      });
      
      // Navigate back to previous screen (or service details if coming from there)
      // Use goBack instead of reset to preserve navigation history
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        // Fallback: navigate to service details if can't go back
        navigation.navigate('ServiceDetails', { serviceId: updatedServiceId });
      }
    } catch (error: any) {
      console.error('=== UPDATE SERVICE ERROR ===');
      console.error('Error:', error);
      console.error('Error response:', error?.response);
      console.error('Error data:', error?.response?.data);
      console.error('===========================');
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
    isUpdateServiceLoading,
    isServiceLoading,
  };
};

export default useEditServiceController;

