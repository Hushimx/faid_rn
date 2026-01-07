import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Asset } from 'react-native-image-picker';
import { ProfileApis } from 'services';
import { useAuthStore } from 'store';
import { IUser } from 'types';
import {
  dataExtractor,
  imagePicker,
  ShowSnackBar,
  UpdateProfileScheme,
} from 'utils';

const useUpdateProfileController = () => {
  const { user } = useAuthStore();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    dirty,
  } = useFormik({
    initialValues: {
      firstName: user?.first_name,
      lastName: user?.last_name,
      profileImage: user?.profile_picture as any,
    },
    validationSchema: UpdateProfileScheme(t),
    validateOnChange: true,
    onSubmit: () => onSaveChanges(),
  });
  const { setUser } = useAuthStore();
  const { isPending, mutate, mutateAsync } = useMutation<any, any, FormData>({
    mutationFn: async formData => await ProfileApis.updateProfile(formData),
  });
  const onSelectImagePress = async () => {
    try {
      const res = await imagePicker();
      if (res?.assets?.length) setFieldValue('profileImage', res?.assets[0]);
    } catch (e) {}
  };

  const onSaveChanges = async () => {
    // Check if there's a new image selected (Asset object, not a string)
    const hasNewImage = values?.profileImage && typeof values.profileImage !== 'string';
    
    // Only proceed if form is dirty OR there's a new image to upload
    if (!dirty && !hasNewImage) {
      navigation.goBack();
      return;
    }

    const formData = new FormData();

    formData.append('first_name', values.firstName);
    formData.append('last_name', values.lastName);

    // Only append profile_picture if it's a new image (Asset object)
    // If it's a string, it means the user didn't select a new image
    if (hasNewImage) {
      const image = values.profileImage as Asset;
      if (image?.uri) {
        // Generate a proper filename with extension
        let fileName = image.fileName || 'profile.jpg';
        // Remove path separators if present
        fileName = fileName.split('/').pop() || fileName;
        fileName = fileName.split('\\').pop() || fileName;
        // Ensure it has an extension
        if (!fileName.includes('.')) {
          const ext = image.type?.split('/')[1] || 'jpg';
          fileName = `profile.${ext}`;
        }
        
        formData.append('profile_picture', {
          uri: image.uri,
          name: fileName,
          type: image.type || 'image/jpeg',
        } as any);
      }
    }

    try {
      const res = await mutateAsync(formData);
      const data: IUser = dataExtractor(res);
      setUser(data);
      navigation.goBack();
      ShowSnackBar({
        text: t('profileUpdatedSuccess'),
      });
    } catch (e) {
      // Handle error if needed
    }
  };
  return {
    values,
    handleChange,
    errors,
    touched,
    handleSubmit,
    onSelectImagePress,
    isLoading: isPending,
  };
};

export default useUpdateProfileController;
