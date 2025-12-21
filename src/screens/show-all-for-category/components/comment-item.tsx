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
      <Box marginHorizontal="s">
        <UserAvatar image={userImage} />
        <AppSpacer variant="ss" />
        <AppText fontWeight={'500'}>
          {userName}{' '}
          <AppText color="customGray">. {createdAtHelper(createdAt)}</AppText>
        </AppText>

        <AppSpacer variant="ss" />
        <Rating size={15} disabled rating={rating} />
        <AppSpacer variant="ss" />

        <AppText color="customGray" fontWeight={'400'}>
          {comment}
        </AppText>
      </Box>
    </Box>
  );
};

export default CommentItem;
