import { useInfiniteQuery } from '@tanstack/react-query';
import { Box } from 'common';
import { AppButton, AppSpacer, AppText } from 'components';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ServicesApis } from 'services';
import { IModalRef, IServiceReviewResponse, QUERIES_KEY_ENUM } from 'types';
import { dataExtractor, metaExtractor } from 'utils';
import AddCommentsModal from './add-comments-modal';
import CommentItem from './comment-item';
import { useAuthStore } from 'store';
import { useMemoizedData } from 'hooks';

const Comments = ({
  serviceId,
  vendorId,
}: {
  serviceId: number;
  vendorId: number;
}) => {
  const { t } = useTranslation();
  const addCommentsModalRef = useRef<IModalRef>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isPending,
  } = useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      ServicesApis.getReviews({ serviceId, page: pageParam }),
    queryKey: [QUERIES_KEY_ENUM.get_service_reviews, serviceId],
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const meta = metaExtractor(lastPage);
      return meta?.has_more ? (meta?.current_page || 0) + 1 : undefined;
    },
  });
  const { user } = useAuthStore();
  const allData = useMemoizedData<IServiceReviewResponse>(data);

  const firstComment = allData?.[0];
  const isServiceOwner = vendorId === user?.id;

  return (
    <Box overflow="hidden">
      <AppSpacer />
      <AppText fontWeight={'700'} color="cutomBlack" variant="s2">
        {t('comments')}
      </AppText>
      <AppSpacer variant="ss" />
      {firstComment ? (
        <CommentItem
          userImage={firstComment?.user?.profile_picture}
          userName={firstComment?.user?.name}
          comment={firstComment?.comment}
          createdAt={firstComment?.created_at}
          rating={firstComment?.rating}
        />
      ) : (
        <Box
          width={'100%'}
          alignItems="center"
          justifyContent="center"
          marginBottom="sm"
        >
          <AppText>{t('errors.noCommentsAdded')}</AppText>
        </Box>
      )}

      {!!allData?.length && (
        <Box paddingHorizontal="sm">
          <AppButton
            label={isServiceOwner ? t('showComments') : t('addComment')}
            isOutLined
            onPress={() => addCommentsModalRef?.current?.openModal()}
          />
        </Box>
      )}

      <AddCommentsModal
        ref={addCommentsModalRef}
        allReviews={allData}
        serviceId={serviceId}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isError={isError}
        loading={isPending}
        isServiceOwner={isServiceOwner}
      />
    </Box>
  );
};

export default Comments;
