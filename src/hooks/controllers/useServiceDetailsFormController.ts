import { useFormik } from 'formik';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  imagePicker,
  imageVideoPicker,
  reverseGeocode,
} from 'utils';
import { HomeApis, ServicesApis } from 'services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CommonActions, useNavigation } from '@react-navigation/native';
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
  locationLink: string;
  faqs: {
    questionEn: string;
    questionAr: string;
    answerEn: string;
    answerAr: string;
  }[];
  currentQuestion: string;
  currentAnswer: string;
  profilePicture: Asset | null;
  serviceMedia: Asset[];

  serviceType: PRICE_TYPE_ENUM;
  lat: number;
  lng: number;
  category_id: number | null;
  // status: SERVICE_STATUS_ENUM | null;
  city: string | null;
}

const useServiceDetailsFormController = () => {
  const { t } = useTranslation();
  const navigation: any = useNavigation();
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
      locationLink: '',
      faqs: [newFaq],
      currentQuestion: '',
      currentAnswer: '',
      profilePicture: null,
      serviceMedia: [],
      serviceType: PRICE_TYPE_ENUM?.fixed,
      lat: 0,
      lng: 0,
      category_id: null,
      // status: null,
      city: null,
    },
    validationSchema,
    validateOnChange: true,
    onSubmit: values => onUploadServicePress(),
  });
  const { values } = formik;
  const { serviceMedia, profilePicture, category_id } = formik.values;
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryFn: () => HomeApis.getCategories(),
    queryKey: [QUERIES_KEY_ENUM.categories],
  });

  const onUploadProfilePicture = async () => {
    try {
      const res = await imagePicker();
      if (res?.assets?.length) {
        formik.setFieldValue('profilePicture', res?.assets[0]);
      }
    } catch (e) {
      console.log(e);
    }
  };

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
      formik.setFieldValue('fullLocation', res?.display_name);
      formik.setFieldValue('lat', latitude);
      formik.setFieldValue('lng', longitude);
      formik.setFieldValue('city', res?.address?.city);
    } catch (e) {
      console.log('Error getting address:', e);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const onUploadServicePress = async () => {
    const formData = new FormData();
    formData.append('category_id', category_id);
    formData.append('title[en]', values.serviceTitleEn);
    formData.append('title[ar]', values.serviceTitleAr);
    formData.append('description[en]', values.serviceDescriptionEn);
    formData.append('description[ar]', values.serviceDescriptionAr);
    formData.append('price_type', values.serviceType);
    formData.append('price', values.serviceCost);
    formData.append('lat', values.lat.toString());
    formData.append('lng', values.lng.toString());
    // formData.append('status', values?.status);
    formData.append('address', values?.fullLocation);
    formData.append('city', values?.city);
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
    });

    // // Add profile picture as the last media item with is_primary flag
    if (profilePicture) {
      const primaryIndex = serviceMedia?.length;
      formData.append(`media[${primaryIndex}][file]`, {
        uri: profilePicture.uri,
        type: profilePicture.type,
        name: profilePicture.fileName,
      });
      formData.append(`media[${primaryIndex}][type]`, 'image');
      formData.append(`media[${primaryIndex}][is_primary]`, 1);
    }

    try {
      const res = await AddServiceMutation(formData);
      const data = dataExtractor<IServiceResponse>(res);
      const serviceId = data?.id;
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
        queryKey: [QUERIES_KEY_ENUM.vendor_services, QUERIES_KEY_ENUM.services],
      });
    } catch (e) {}
  };

  return {
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
    categories: dataExtractor(categories) as ICategory[],
    isLocationLoading,
    isAddServiceLoading,
  };
};

export default useServiceDetailsFormController;
