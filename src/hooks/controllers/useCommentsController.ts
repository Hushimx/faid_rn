import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServicesApis } from 'services';
import { ShowSnackBar } from 'utils';
import * as Yup from 'yup';

const useCommentsController = (serviceId: number) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(1);

  const { values, errors, touched, handleChange, handleSubmit, resetForm } =
    useFormik({
      initialValues: {
        comment: '',
      },
      validationSchema: Yup.object().shape({
        comment: Yup.string().required(t('errors.commentRequired')),
      }),
      onSubmit: () => onAddReview(),
    });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { comment: string; rating: number }) =>
      await ServicesApis.addReview({
        serviceId,
        comment: data.comment,
        rating: data.rating,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query => query.queryKey.includes(serviceId),
      });

      resetForm();
      setRating(1);
    },
    onError: () => {},
  });
  const handleRatingChange = useCallback(
    (value: number) => {
      setRating(value);
    },
    [rating],
  );

  const onAddReview = () => {
    if (rating === 0) {
      ShowSnackBar({
        text: t('pleaseSelectRating'),
      });
      return;
    }
    mutate({ comment: values.comment, rating });
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    rating,
    setRating,
    isPending,
    handleRatingChange,
  };
};

export default useCommentsController;
