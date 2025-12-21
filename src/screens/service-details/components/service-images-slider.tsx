import { Box } from 'common';
import { AppText, Camera } from 'components';
import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  Platform,
  I18nManager,
} from 'react-native';
import { IServiceMedia } from 'types';
import Video from 'react-native-video';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH * 0.95;

const ImageSlider = ({
  images,
  videos,
}: {
  images: IServiceMedia[];
  videos: IServiceMedia[];
}) => {
  const ref = useRef<FlatList<any> | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imagesWithServiceImage = images
    .concat(videos)
    ?.filter(item => !item?.is_primary);

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={ref}
        data={imagesWithServiceImage}
        horizontal
        keyExtractor={(_, i) => i.toString()}
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH} // snap by full screen width
        snapToAlignment="center"
        decelerationRate="fast"
        pagingEnabled={Platform.OS === 'ios'} // iOS uses pagingEnabled nicely
        bounces={false}
        overScrollMode="never"
        onMomentumScrollEnd={event => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const index = I18nManager.isRTL
            ? Math.round(
                (SCREEN_WIDTH * (imagesWithServiceImage?.length - 1) -
                  offsetX) /
                  SCREEN_WIDTH,
              )
            : Math.round(offsetX / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          // ITEM container = full screen width -> ensures snapping to center
          <View style={styles.itemContainer}>
            {item?.type === 'video' ? (
              <Video
                source={{ uri: item?.url }}
                style={styles.imageHolder}
                resizeMode="cover"
                controls
                paused
              />
            ) : (
              <Image
                source={{ uri: item?.url }}
                style={styles.imageHolder}
                resizeMode="cover"
              />
            )}
          </View>
        )}
      />
      <Box
        position="absolute"
        bottom={30}
        right={10}
        backgroundColor="white"
        borderRadius={20}
        paddingHorizontal="sm"
        flexDirection="row"
        alignItems="center"
      >
        <Box marginBottom="ss" marginRight="sm">
          <Camera />
        </Box>
        <AppText>
          {imagesWithServiceImage?.length ? currentIndex + 1 : 0}/
          {imagesWithServiceImage?.length}
        </AppText>
      </Box>
    </View>
  );
};

export default ImageSlider;

const styles = StyleSheet.create({
  wrapper: {
    height: 300, // adjust to your desired height or make dynamic
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    width: SCREEN_WIDTH, // IMPORTANT: full screen width
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageHolder: {
    width: IMAGE_WIDTH, // 95% of screen width
    height: '90%',
    borderRadius: 12,
    overflow: 'hidden',
    // optional shadow/elevation can be added here
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
