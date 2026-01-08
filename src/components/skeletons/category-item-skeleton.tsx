import { Box, useAppTheme } from 'common';
import { FC } from 'react';
import { useWindowDimensions } from 'react-native';
import Skeleton from './skeleton';

const CategoryItemSkeleton: FC = () => {
  const { width } = useWindowDimensions();
  const { colors } = useAppTheme();

  return (
    <Box
      flex={1}
      backgroundColor="white"
      borderRadius={10}
      paddingBottom="s"
      minWidth={width * 0.5}
    >
      <Skeleton width="100%" height={185} borderRadius={10} />
      
      <Box width={'95%'} alignSelf="center">
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingTop="s"
          flexWrap="wrap"
        >
          <Box flex={1} marginRight="s">
            <Skeleton width="80%" height={16} borderRadius={4} />
          </Box>
          <Skeleton width={60} height={14} borderRadius={4} />
        </Box>

        <Box flexDirection="row" alignItems="center" marginTop="ss">
          <Skeleton width={100} height={14} borderRadius={4} />
        </Box>
        
        <Box marginTop="ss">
          <Skeleton width={80} height={16} borderRadius={4} />
        </Box>
      </Box>

      <Box
        flexDirection="row"
        alignItems="center"
        marginTop="s"
        width={'95%'}
        alignSelf="center"
        justifyContent="space-between"
      >
        <Box flexDirection="row" justifyContent="center">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Box marginLeft="s" flex={1}>
            <Skeleton width={80} height={14} borderRadius={4} />
            <Box marginTop="ss">
              <Skeleton width={100} height={12} borderRadius={4} />
            </Box>
          </Box>
        </Box>
        <Skeleton width={40} height={40} borderRadius={10} />
      </Box>
    </Box>
  );
};

export default CategoryItemSkeleton;





