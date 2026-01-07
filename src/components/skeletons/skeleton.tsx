import { Box, useAppTheme } from 'common';
import { FC, ReactNode, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
  children?: ReactNode;
}

const Skeleton: FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  children,
}) => {
  const { colors } = useAppTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      false,
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmer.value,
      [0, 1],
      [-300, 300],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      shimmer.value,
      [0, 0.5, 1],
      [0.3, 0.7, 0.3],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateX }],
      opacity,
    };
  });

  return (
    <Box
      width={width}
      height={height}
      borderRadius={borderRadius}
      backgroundColor="grayLight"
      overflow="hidden"
      style={style}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            backgroundColor: colors.grayLight,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
            },
            animatedStyle,
          ]}
        />
      </Animated.View>
      {children}
    </Box>
  );
};

const styles = StyleSheet.create({
  shimmer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shimmerOverlay: {
    width: '50%',
    height: '100%',
    position: 'absolute',
  },
});

export default Skeleton;

