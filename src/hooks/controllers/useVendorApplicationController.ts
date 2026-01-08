import { useMutation, useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { VendorApplicationApis, HomeApis } from 'services';
import { ICategory, IVendorApplication, QUERIES_KEY_ENUM } from 'types';
import { dataExtractor } from 'utils';
import { useNavigation } from '@react-navigation/native';
import { ShowSnackBar } from 'utils';
import * as Yup from 'yup';

export interface VendorApplicationFormValues {
  business_name?: string;
  city?: string;
  bio?: string;
  category_id?: number | null;
  custom_category?: string;
}

const useVendorApplicationController = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // Validation schema
  const validationSchema = Yup.object().shape({
    business_name: Yup.string().required(t('errors.fieldRequired')),
    bio: Yup.string().required(t('errors.fieldRequired')).max(1000, t('errors.fieldRequired')),
    city: Yup.string().required(t('errors.fieldRequired')),
    category_id: Yup.mixed().required(t('errors.fieldRequired')),
    custom_category: Yup.string().when('category_id', {
      is: (val: any) => val === 'others',
      then: (schema) => schema.required(t('errors.fieldRequired')),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const formik = useFormik<VendorApplicationFormValues>({
    initialValues: {
      business_name: '',
      city: '',
      bio: '',
      category_id: null,
      custom_category: '',
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
      // Validate form first
      const errors = await formik.validateForm();
      
      if (Object.keys(errors).length > 0) {
        formik.setTouched({
          business_name: true,
          city: true,
          bio: true,
          category_id: true,
          custom_category: formik.values.category_id === 'others',
        });
        return;
      }

      // Prepare submit data with trimmed values
      const businessName = formik.values.business_name?.trim() || '';
      const city = formik.values.city?.trim() || '';
      const bio = formik.values.bio?.trim() || '';
      
      if (!businessName || !city || !bio) {
        ShowSnackBar({
          text: t('errors.fieldRequired'),
          type: 'error',
        });
        return;
      }

      const submitData: VendorApplicationFormValues = {
        business_name: businessName,
        city: city,
        bio: bio,
        category_id: formik.values.category_id === 'others' ? undefined : (formik.values.category_id as number | undefined),
        custom_category: formik.values.category_id === 'others' ? (formik.values.custom_category?.trim() || '') : undefined,
      };

      // Ensure either category_id or custom_category is provided
      if (!submitData.category_id && !submitData.custom_category) {
        ShowSnackBar({
          text: t('errors.fieldRequired'),
          type: 'error',
        });
        return;
      }

      await submitApplicationMutation(submitData);
    } catch (error: any) {
      console.error('Submit error:', error);
      // Error is already handled by mutation onError
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

  return {
    formik,
    isSubmitting,
    categoriesWithOthers,
    onSelectCategory,
    existingApplication,
    isApplicationLoading,
    refetchApplication,
  };
};

export default useVendorApplicationController;

