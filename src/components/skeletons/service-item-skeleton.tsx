import { Box, SPACING } from 'common';
import { FC } from 'react';
import Skeleton from './skeleton';

const ServiceItemSkeleton: FC = () => {
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      width={80}
      marginLeft="ss"
    >
      <Skeleton width={80} height={80} borderRadius={40} />
      <Box marginTop="ss" width={60}>
        <Skeleton width="100%" height={14} borderRadius={4} />
      </Box>
    </Box>
  );
};

export default ServiceItemSkeleton;





