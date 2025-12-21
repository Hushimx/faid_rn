import { Rating } from '@kolking/react-native-rating';
import { Box, useAppTheme } from 'common';
import {
  AppButton,
  AppErrorMessage,
  AppInput,
  AppSpacer,
  BaseModal,
} from 'components';
import { LoadingErrorFlatListHandler } from 'hoc';
import { useCommentsController } from 'hooks';
import { forwardRef, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { IServiceReviewResponse } from 'types';
import { CommentItem } from '.';

const AddCommentModal = (
  props: {
    allReviews: IServiceReviewResponse[];
    serviceId: number;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
    isError: boolean;
    loading: boolean;
    isServiceOwner: boolean;
  },
  ref: any,
) => {
  const {
    allReviews,
    serviceId,
    isError,
    isFetchingNextPage,
    loading,
    isServiceOwner,
  } = props;
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const {
    rating,
    values,
    handleChange,
    isPending,
    handleRatingChange,
    touched,
    errors,
    handleSubmit,
  } = useCommentsController(serviceId);

  return (
    <BaseModal ref={ref}>
      {/* <AppSpaceWrapper> */}
      <LoadingErrorFlatListHandler
        isError={isError}
        isFetching={isFetchingNextPage}
        loading={loading}
        data={allReviews}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        style={{ width: '95%', alignSelf: 'center' }}
        ListHeaderComponent={
          isServiceOwner ? undefined : (
            <Fragment>
              <AppSpacer />
              <Box width={'100%'} alignItems="center" justifyContent="center">
                <Rating rating={rating} onChange={handleRatingChange} />
              </Box>
              <AppSpacer />

              <AppInput
                placeholder={t('addComment')}
                value={values?.comment}
                onChangeText={handleChange('comment')}
                textStyle={styles.textContainer}
                style={[
                  styles.inputContainer,
                  {
                    borderColor: colors.primary,
                  },
                ]}
              />
              <AppErrorMessage
                isError={!!errors.comment && !!touched?.comment}
                text={errors?.comment!}
              />
              <AppSpacer />
              <AppButton
                style={{ width: '100%' }}
                label={t('addComment')}
                onPress={handleSubmit}
                isLoading={isPending}
              />

              <AppSpacer variant="sm" />
            </Fragment>
          )
        }
        renderItem={({ item }) => (
          <CommentItem
            userImage={item?.user?.profile_picture}
            userName={item?.user?.name}
            comment={item?.comment}
            createdAt={item?.created_at}
            rating={item?.rating}
          />
        )}
      />

      {/* </AppSpaceWrapper> */}
    </BaseModal>
  );
};

export default forwardRef(AddCommentModal);

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 15,
  },
  textContainer: {
    height: 60,
    textAlignVertical: 'top',
  },
});
