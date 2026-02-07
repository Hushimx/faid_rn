import { Box } from 'common';
import { FC } from 'react';
import { useWindowDimensions, StyleSheet } from 'react-native';
import Skeleton from './skeleton';

const ServiceDetailsSkeleton: FC = () => {
  const { width } = useWindowDimensions();
  const horizontalPadding = 16;
  const contentWidth = width - horizontalPadding * 2;
  const imageHeight = contentWidth * (10 / 16); // 16:10 aspect ratio

  return (
    <Box flex={1} backgroundColor="pageBackground" paddingHorizontal="m">
      {/* Header row: back + title, edit button */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingVertical="m"
      >
        <Box flexDirection="row" alignItems="center" flex={1}>
          <Skeleton width={24} height={24} borderRadius={4} />
          <Skeleton
            width={120}
            height={20}
            borderRadius={4}
            style={styles.headerTitle}
          />
        </Box>
        <Skeleton width={40} height={40} borderRadius={20} />
      </Box>

      {/* Image area: 16:10 aspect, rounded-3xl (24px) */}
      <Box marginBottom="l">
        <Skeleton
          width="100%"
          height={imageHeight}
          borderRadius={24}
          style={styles.imageSkeleton}
        />
      </Box>

      {/* Title block + share/favorite */}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
        marginBottom="l"
      >
        <Box flex={1}>
          <Skeleton width="60%" height={28} borderRadius={4} />
          <Box flexDirection="row" alignItems="center" marginTop="s">
            <Skeleton width={80} height={16} borderRadius={4} />
            <Skeleton
              width={90}
              height={14}
              borderRadius={4}
              style={styles.ratingText}
            />
          </Box>
        </Box>
        <Box flexDirection="row">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Box marginLeft="s">
            <Skeleton width={40} height={40} borderRadius={20} />
          </Box>
        </Box>
      </Box>

      {/* Description section */}
      <Box marginBottom="l">
        <Skeleton width={80} height={20} borderRadius={4} />
        <Skeleton
          width="100%"
          height={14}
          borderRadius={4}
          style={styles.descLine}
        />
        <Skeleton
          width="95%"
          height={14}
          borderRadius={4}
          style={styles.descLine}
        />
        <Skeleton
          width="85%"
          height={14}
          borderRadius={4}
          style={styles.descLine}
        />
      </Box>

      {/* Location section */}
      <Box marginBottom="l">
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom="s"
        >
          <Skeleton width={70} height={20} borderRadius={4} />
          <Skeleton width={100} height={16} borderRadius={4} />
        </Box>
        <Skeleton
          width="100%"
          height={192}
          borderRadius={16}
          style={styles.mapSkeleton}
        />
      </Box>

      {/* Bottom pill indicator */}
      <Box
        flexDirection="row"
        justifyContent="center"
        paddingVertical="s"
        marginBottom="xl"
      >
        <Skeleton width={128} height={6} borderRadius={3} />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  headerTitle: { marginLeft: 8 },
  ratingText: { marginLeft: 8 },
  imageSkeleton: { alignSelf: 'center' },
  descLine: { marginTop: 8 },
  mapSkeleton: {},
});

export default ServiceDetailsSkeleton;
