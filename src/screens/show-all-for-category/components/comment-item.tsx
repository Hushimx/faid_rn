import { Box } from 'common';
import { AppSpacer, AppText, UserAvatar } from 'components';
import { FC } from 'react';
import { ICommentItem } from 'types';
import VerticalDashedLine from './vertical-dashed-line';
import { Rating } from '@kolking/react-native-rating';
import { createdAtHelper } from 'utils';

const CommentItem: FC<ICommentItem> = ({
  userImage,
  userName,
  comment,
  createdAt,
  rating,
}) => {
  return (
    <Box flexDirection="row" marginBottom="sm">
      <Box alignItems="center" overflow="hidden">
        <Box
          height={10}
          width={10}
          backgroundColor={'customGray'}
          borderRadius={5}
          marginBottom="ss"
        />
        <VerticalDashedLine />
      </Box>
      <Box marginHorizontal="s" flex={1}>
        {/* Name and Rating in same row */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="ss">
          <Box flexDirection="row" alignItems="center" flex={1}>
            <UserAvatar image={userImage} />
            <AppSpacer variant="ss" />
            <Box flex={1}>
              <AppText fontWeight={'500'}>
                {userName}
              </AppText>
              <AppText color="customGray" variant="s3">
                {createdAtHelper(createdAt)}
              </AppText>
            </Box>
          </Box>
          <Rating size={15} disabled rating={rating} />
        </Box>

        {/* Comment below */}
        <AppText color="customGray" fontWeight={'400'}>
          {comment}
        </AppText>
      </Box>
    </Box>
  );
};

export default CommentItem;
