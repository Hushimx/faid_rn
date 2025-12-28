import { Box } from 'common';
import { AppImage, AppText, Camera, ImageViewerModal } from 'components';
import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  Platform,
  I18nManager,
  Pressable,
} from 'react-native';
import { IServiceMedia } from 'types';
import Video from 'react-native-video';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH * 0.95;

interface IProps<T = IServiceMedia> {
  data: T[];
  onPress?: (item: T, index: number) => void;
  height?: number;
  showMediaCount?: boolean;
  getUrl?: (item: T) => string;
  getType?: (item: T) => 'image' | 'video';
}

const AppSlider = <T extends Record<string, any> = IServiceMedia>({
  data,
  onPress,
  height = 300,
  showMediaCount = true,
  getUrl,
  getType,
}: IProps<T>) => {
  const ref = useRef<FlatList<any> | null>(null);
  const imageViewerRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) {
    return null;
  }

  // Default extractors for IServiceMedia
  const extractUrl = getUrl || ((item: any) => item?.url || item?.image);
  const extractType = getType || ((item: any) => item?.type || 'image');

  // Convert data to IServiceMedia format for ImageViewerModal
  const convertedData: IServiceMedia[] = data.map(item => ({
    url: extractUrl(item),
    type: extractType(item),
    is_primary: false,
  }));

  const handleImagePress = (item: T, index: number) => {
    if (onPress) {
      onPress(item, index);
    } else {
      // Open image viewer modal
      imageViewerRef.current?.openModal(index);
    }
  };

  return (
    <>
      <View style={[styles.wrapper, { height }]}>
        <FlatList
          ref={ref}
          data={data}
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
                  (SCREEN_WIDTH * (data.length - 1) - offsetX) / SCREEN_WIDTH,
                )
              : Math.round(offsetX / SCREEN_WIDTH);
            setCurrentIndex(index);
          }}
          renderItem={({ item, index }) => {
            const itemUrl = extractUrl(item);
            const itemType = extractType(item);

            return (
              // ITEM container = full screen width -> ensures snapping to center
              <Pressable
                style={styles.itemContainer}
                onPress={() => handleImagePress(item, index)}
              >
                {itemType === 'video' ? (
                  <Video
                    source={{ uri: itemUrl }}
                    style={styles.imageHolder}
                    resizeMode="contain"
                    controls
                    paused
                  />
                ) : (
                  <AppImage
                    source={{ uri: itemUrl }}
                    style={styles.imageHolder}
                    resizeMode="contain"
                  />
                )}
              </Pressable>
            );
          }}
        />
        {showMediaCount && (
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
              {data?.length ? currentIndex + 1 : 0}/{data?.length}
            </AppText>
          </Box>
        )}
      </View>

      <ImageViewerModal ref={imageViewerRef} data={convertedData} />
    </>
  );
};

export default AppSlider;

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
