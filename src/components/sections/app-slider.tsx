import { Box } from 'common';
import { AppImage, AppText, Camera, ImageViewerModal } from 'components';
import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Platform,
  I18nManager,
  Pressable,
} from 'react-native';
import { IServiceMedia } from 'types';
import Video from 'react-native-video';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const CONTENT_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const IMAGE_WIDTH = SCREEN_WIDTH * 0.95;

interface IProps<T = IServiceMedia> {
  data: T[];
  onPress?: (_item: T, _index: number) => void;
  height?: number;
  showMediaCount?: boolean;
  getUrl?: (_item: T) => string;
  getType?: (_item: T) => 'image' | 'video';
  /** Aspect ratio for image container (e.g. 16/10). When set, height is computed from content width. */
  aspectRatio?: number;
  /** Border radius for image container. Default 12. */
  borderRadius?: number;
  /** Badge position: 'left' (HTML-style dark overlay) or 'right' (default). */
  badgePosition?: 'left' | 'right';
  /** Badge style: 'dark' = black/40 overlay (HTML-style), 'light' = white bg. */
  badgeVariant?: 'dark' | 'light';
  /** Use full content width with horizontal padding instead of 95% width. */
  fullWidthWithPadding?: boolean;
}

const AppSlider = <T extends Record<string, any> = IServiceMedia>({
  data,
  onPress,
  height,
  showMediaCount = true,
  getUrl,
  getType,
  aspectRatio,
  borderRadius = 12,
  badgePosition = 'right',
  badgeVariant = 'light',
  fullWidthWithPadding = false,
}: IProps<T>) => {
  const ratio = aspectRatio ?? 16 / 10;
  const computedHeight =
    height ??
    (fullWidthWithPadding ? CONTENT_WIDTH / ratio : 300);
  const imageWidth = fullWidthWithPadding ? CONTENT_WIDTH : IMAGE_WIDTH;
  const ref = useRef<FlatList<any> | null>(null);
  const imageViewerRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) {
    return null;
  }

  // Default extractors for IServiceMedia
  const extractUrl = getUrl || ((it: any) => it?.url || it?.image);
  const extractType = getType || ((it: any) => it?.type || 'image');

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
      <View style={[styles.wrapper, { height: computedHeight }]}>
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
                    style={[
                      styles.imageHolder,
                      { width: imageWidth, borderRadius },
                      fullWidthWithPadding && styles.imageHolderFullHeight,
                    ]}
                    resizeMode="cover"
                    controls
                    paused
                  />
                ) : (
                  <AppImage
                    source={{ uri: itemUrl }}
                    style={[
                      styles.imageHolder,
                      { width: imageWidth, borderRadius },
                      fullWidthWithPadding && styles.imageHolderFullHeight,
                    ]}
                    resizeMode="cover"
                  />
                )}
              </Pressable>
            );
          }}
        />
        {showMediaCount && (
          <Box
            position="absolute"
            bottom={16}
            left={badgePosition === 'left' ? 16 : undefined}
            right={badgePosition === 'right' ? 10 : undefined}
            backgroundColor={badgeVariant === 'dark' ? undefined : 'white'}
            borderRadius={20}
            paddingHorizontal="sm"
            paddingVertical="ss"
            flexDirection="row"
            alignItems="center"
            style={badgeVariant === 'dark' ? styles.badgeDark : undefined}
          >
            <Box marginRight="sm">
              <Camera
                size={14}
                color={badgeVariant === 'dark' ? '#fff' : undefined}
              />
            </Box>
            <AppText
              color={badgeVariant === 'dark' ? 'white' : undefined}
              variant="s3"
            >
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
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageHolder: {
    width: IMAGE_WIDTH,
    height: '90%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageHolderFullHeight: {
    height: '100%',
  },
  badgeDark: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
