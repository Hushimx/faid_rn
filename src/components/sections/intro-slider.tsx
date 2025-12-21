import { useAppTheme } from 'common';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  I18nManager,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
interface IntroSliderProps {
  data: any[];
  renderItem: ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => React.ReactElement;
  activeDotStyle?: ViewStyle;
  dotStyle?: ViewStyle;
  onDone?: () => void;
  onSkip?: () => void;
  width?: number;
}

const IntroSlider = ({
  data,
  renderItem,
  activeDotStyle,
  dotStyle,
  width = SCREEN_WIDTH,
}: IntroSliderProps) => {
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<Animated.FlatList<any>>(null);
  const { colors } = useAppTheme();

  const handleScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Replicating AppSlider's logic for index calculation
  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = I18nManager.isRTL
      ? Math.round((width * (data.length - 1) - offsetX) / width)
      : Math.round(offsetX / width);

    // Clamp index just in case
    const safeIndex = Math.max(0, Math.min(index, data.length - 1));
    setCurrentIndex(safeIndex);
  };

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          {data.map((_, index) => {
            const animatedDotStyle = useAnimatedStyle(() => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];

              // Using Math.abs for robustness with potential negative RTL offsets
              const absScrollX = Math.abs(scrollX.value);

              // In RTL, if offsets are "Right to Left" (decreasing from Max),
              // we might need to adjust logic if using standard interpolation.
              // However, since we are interpolating around "index * SCREEN_WIDTH",
              // if RTL Android starts at Max and goes down, we need to invert the mapping?
              // `AppSlider` logic suggests: Index 0 is at `(N-1)*W`.
              // So for RTL, Item 0 is at offset `(N-1)*W`. Item 1 is at `(N-2)*W`.

              // Reanimated's `scrollX` usually reflects the raw offset.
              // IF RTL:
              //   Item 0: Offset ~ Start (could be 0 or Max depending on OS version/impl).
              //   RN usually tries to normalize `contentOffset` to start at 0 for "start"?
              //   Or is it inverted?
              //   `AppSlider` manual calc implies:
              //   RTL Index = (TotalWidth - Offset) / Width
              //   => Offset = TotalWidth - Index * Width
              //   => Index 0 -> Offset = TotalWidth.
              // This implies Android RTL starts at "Max Width" and scrolls to 0?

              // If so, `inputRange` for Index 0 should be around `TotalWidth`!
              // But standard LTR `inputRange` for Index 0 is `0`.

              // To handle this universally without complex conditional hooks:
              // We can rely on `currentIndex` (state) for a simple non-animated dot if animation is buggy,
              // or try to normalize `scrollX`.

              // For now, let's stick to the "Basic" interpolation which assumes 0 -> 1 -> 2
              // If RTL is messed up, the dots might just look static or wrong.
              // Given "Make it like AppSlider", maybe I should just use `currentIndex` for the styling
              // and DROP the smooth interpolation if it's risky?
              // "Intro Slider library" usually has smooth interpolation.
              // Let's keep interpolation but wrap it in robust logic or allow fallback.

              // Let's assume standard behavior first.

              const dotWidth = interpolate(
                absScrollX,
                inputRange,
                [10, 40, 10],
                Extrapolation.CLAMP,
              );

              const opacity = interpolate(
                absScrollX,
                inputRange,
                [0.5, 1, 0.5],
                Extrapolation.CLAMP,
              );

              return {
                width: dotWidth,
                opacity: opacity,
              };
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  dotStyle,
                  {
                    backgroundColor:
                      activeDotStyle?.backgroundColor || colors.primary,
                  },
                  animatedDotStyle,
                ]}
              />
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item, index }) => (
          <View style={[styles.itemRef, { width: width }]}>
            {renderItem({ item, index })}
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        // Props from AppSlider
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        snapToAlignment="center"
        decelerationRate="fast"
        pagingEnabled={Platform.OS === 'ios'}
        bounces={false}
        overScrollMode="never"
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}

        // Ensure standard behavior
        // style={{ direction: I18nManager.isRTL ? 'rtl' : 'ltr' }}
        // Removing explicit direction to let RN handle it, as AppSlider does.
      />
      <Pagination />
    </View>
  );
};

export default IntroSlider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemRef: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDots: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    backgroundColor: '#ccc',
  },
});
