import { Box } from 'common';
import { AppImage, AppPresseble } from 'components';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import { Linking } from 'react-native';
import PagerView from 'react-native-pager-view';
import { IBanner } from 'types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH * 0.95;

interface IProps {
  banners: IBanner[];
}

const Banners: React.FC<IProps> = ({ banners }) => {
  const pagerRef = useRef<PagerView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const dotAnimations = React.useMemo(
    () => banners.map((_, index) => new Animated.Value(index === 0 ? 1 : 0)),
    [banners],
  );

  if (!banners || banners.length === 0) {
    return null;
  }

  const handleBannerPress = (banner: IBanner) => {
    if (banner.link) {
      Linking.openURL(banner.link).catch(err =>
        console.error('Failed to open URL:', err),
      );
    }
  };

  const onPageSelected = (e: any) => {
    const newIndex = e.nativeEvent.position;
    setCurrentIndex(newIndex);
    
    // Animate dot transitions
    dotAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: index === newIndex ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  };

  return (
    <Box>
      <View style={styles.wrapper}>
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={onPageSelected}
          pageMargin={0}
        >
          {banners.map((item, index) => (
            <View key={index} style={styles.page}>
              <AppPresseble
                onPress={() => handleBannerPress(item)}
                style={styles.itemContainer}
              >
                <View style={styles.imageHolder}>
                  <AppImage
                    source={{ uri: item.image_url }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
              </AppPresseble>
            </View>
          ))}
        </PagerView>
        {banners.length > 1 && (
          <View style={styles.pagination}>
            {banners.map((_, index) => {
              const isActive = index === currentIndex;
              const dotWidth = dotAnimations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [6, 24],
              });
              const dotOpacity = dotAnimations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 1],
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      width: dotWidth,
                      opacity: dotOpacity,
                    },
                    isActive && styles.activeDot,
                  ]}
                />
              );
            })}
          </View>
        )}
      </View>
    </Box>
  );
};

export default Banners;

const styles = StyleSheet.create({
  wrapper: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pagerView: {
    width: SCREEN_WIDTH,
    height: 200,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageHolder: {
    width: IMAGE_WIDTH,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
  },
});
