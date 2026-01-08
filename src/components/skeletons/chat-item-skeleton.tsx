import { Box } from 'common';
import { FC } from 'react';
import Skeleton from './skeleton';

const ChatItemSkeleton: FC = () => {
  return (
    <Box
      backgroundColor="white"
      borderRadius={10}
      padding="m"
      marginBottom="s"
      flexDirection="row"
      alignItems="center"
    >
      {/* Avatar */}
      <Skeleton width={50} height={50} borderRadius={25} />
      <Box marginLeft="m" flex={1}>
        {/* Name and Time */}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="ss"
        >
          <Box flex={1} marginRight="s">
            <Skeleton width="60%" height={16} borderRadius={4} />
          </Box>
          <Skeleton width={50} height={12} borderRadius={4} />
        </Box>

        {/* Service Title */}
        <Box marginBottom="ss">
          <Skeleton width="80%" height={14} borderRadius={4} />
        </Box>

        {/* Last Message Preview */}
        <Skeleton width="70%" height={14} borderRadius={4} />
      </Box>
    </Box>
  );
};

export default ChatItemSkeleton;





