import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Asset } from 'react-native-image-picker';
import { LatLng } from 'react-native-maps';
import { VendorApplicationApis, HomeApis } from 'services';
import { ICityResponse, ICategory, IModalRef, IVendorApplication, QUERIES_KEY_ENUM } from 'types';
import { dataExtractor, imagePicker, reverseGeocode } from 'utils';
import { useNavigation } from '@react-navigation/native';
import { ShowSnackBar } from 'utils';
import * as Yup from 'yup';

export interface VendorApplicationFormValues {
  country_id?: number;
  city_id?: number;
  lat?: number;
  lng?: number;
  banner?: Asset | null;
  bio?: string;
  category_id?: number | null;
  custom_category?: string;
  meta?: any;
  fullLocation?: string;
}

const useVendorApplicationController = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const mapModalRef = useRef<IModalRef>(null);
  const citiesModalRef = useRef<IModalRef>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<ICityResponse | null>(null);
  const queryClient = useQueryClient();

  // Validation schema
  const validationSchema = Yup.object().shape({
    bio: Yup.string().max(1000, t('errors.fieldRequired')),
    city_id: Yup.number().nullable(),
    lat: Yup.number().nullable(),
    lng: Yup.number().nullable(),
    category_id: Yup.mixed().nullable(),
    custom_category: Yup.string().when('category_id', {
      is: (val: any) => val === 'others',
      then: (schema) => schema.required(t('errors.fieldRequired')),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const formik = useFormik<VendorApplicationFormValues>({
    initialValues: {
      country_id: undefined,
      city_id: undefined,
      lat: undefined,
      lng: undefined,
      banner: null,
      bio: '',
      category_id: null,
      custom_category: '',
      meta: undefined,
      fullLocation: '',
    },
    validationSchema,
    validateOnChange: true,
    onSubmit: values => handleSubmit(),
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryFn: () => HomeApis.getCategories(),
    queryKey: [QUERIES_KEY_ENUM.categories],
  });

  const categories: ICategory[] = dataExtractor<ICategory[]>(categoriesData) || [];
  
  // Add "Others" option to categories
  const categoriesWithOthers = [
    ...categories.map(cat => ({ label: cat.name, value: cat.id })),
    { label: t('others'), value: 'others' },
  ];

  // Get existing application
  const {
    data: applicationData,
    isLoading: isApplicationLoading,
    refetch: refetchApplication,
    error: applicationError,
  } = useQuery({
    queryFn: () => VendorApplicationApis.getMyApplication(),
    queryKey: ['vendor-application', 'my-application'],
    retry: false,
    enabled: true,
  });

  const existingApplication: IVendorApplication | null = 
    applicationError?.response?.status === 404 
      ? null 
      : dataExtractor<IVendorApplication>(applicationData);

  // Submit application mutation
  const { mutateAsync: submitApplicationMutation, isPending: isSubmitting } =
    useMutation({
      mutationFn: (data: VendorApplicationFormValues) =>
        VendorApplicationApis.submitApplication(data),
      onSuccess: () => {
        ShowSnackBar({
          text: t('applicationSubmittedSuccessfully'),
        });
        refetchApplication();
        navigation.goBack();
      },
      onError: (error: any) => {
        ShowSnackBar({
          text: error?.response?.data?.message || t('errors.failedToSubmit'),
          type: 'error',
        });
      },
    });

  const handleSubmit = async () => {
    try {
      const submitData: VendorApplicationFormValues = {
        city_id: formik.values.city_id,
        lat: formik.values.lat,
        lng: formik.values.lng,
        banner: formik.values.banner,
        bio: formik.values.bio,
        category_id: formik.values.category_id === 'others' ? undefined : formik.values.category_id,
        custom_category: formik.values.category_id === 'others' ? formik.values.custom_category : undefined,
        meta: formik.values.meta,
      };

      await submitApplicationMutation(submitData);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const onSelectCategory = (value: string | number) => {
    if (value === 'others') {
      formik.setFieldValue('category_id', 'others');
      formik.setFieldValue('custom_category', '');
    } else {
      formik.setFieldValue('category_id', value as number);
      formik.setFieldValue('custom_category', '');
    }
  };

  const onUploadBanner = async () => {
    try {
      const res = await imagePicker();
      if (res?.assets?.length) {
        formik.setFieldValue('banner', res?.assets[0]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onUserSelectLocation = async (location: LatLng) => {
    setIsLocationLoading(true);
    try {
      formik.setFieldValue('lat', location.latitude);
      formik.setFieldValue('lng', location.longitude);

      const address = await reverseGeocode(
        location.latitude,
        location.longitude,
      );
      if (address) {
        formik.setFieldValue('fullLocation', address.display_name);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const onSelectCity = (city: ICityResponse | null) => {
    setSelectedCity(city);
    if (city) {
      formik.setFieldValue('city_id', city.id);
      formik.setFieldValue('country_id', city.country_id);
    } else {
      formik.setFieldValue('city_id', undefined);
      formik.setFieldValue('country_id', undefined);
    }
  };

  return {
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
    refetchApplication,
  };
};

export default useVendorApplicationController;

