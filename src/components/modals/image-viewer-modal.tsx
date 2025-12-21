import { Box } from 'common';
import { forwardRef, useState } from 'react';
import {
  Modal,
  View,
  Image,
  Dimensions,
  StyleSheet,
  Pressable,
  StatusBar,
} from 'react-native';
import { IServiceMedia } from 'types';
import { AppText, CloseCircle } from 'components';
import Video from 'react-native-video';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface IProps {
  data: IServiceMedia[];
  initialIndex?: number;
}

const ImageViewerModal = (props: IProps, ref: any) => {
  const { data, initialIndex = 0 } = props;
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const openModal = (index: number = 0) => {
    setCurrentIndex(index);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  // Expose methods via ref
  if (ref) {
    ref.current = {
      openModal,
      closeModal,
    };
  }

  const currentItem = data[currentIndex];
  const isVideo = currentItem?.type === 'video';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Close Button */}
        <Box position="absolute" top={50} right={20} zIndex={10}>
          <CloseCircle size={30} color="white" onPress={closeModal} />
        </Box>

        {/* Image Counter */}
        {data.length > 1 && (
          <View style={styles.counterContainer}>
            <AppText color="white" variant="s1">
              {currentIndex + 1} / {data.length}
            </AppText>
          </View>
        )}

        {/* Image/Video Display */}
        <Pressable style={styles.imageContainer} onPress={closeModal}>
          {isVideo ? (
            <Video
              source={{ uri: currentItem?.url }}
              style={styles.media}
              resizeMode="contain"
              controls
              paused={false}
            />
          ) : (
            <Image
              source={{ uri: currentItem?.url }}
              style={styles.media}
              resizeMode="contain"
            />
          )}
        </Pressable>

        {/* Navigation Arrows */}
        {data.length > 1 && (
          <>
            {currentIndex > 0 && (
              <Pressable
                style={[styles.navButton, styles.leftButton]}
                onPress={() => setCurrentIndex(currentIndex - 1)}
              >
                <AppText color="white" variant="h4">
                  ‹
                </AppText>
              </Pressable>
            )}
            {currentIndex < data.length - 1 && (
              <Pressable
                style={[styles.navButton, styles.rightButton]}
                onPress={() => setCurrentIndex(currentIndex + 1)}
              >
                <AppText color="white" variant="h4">
                  ›
                </AppText>
              </Pressable>
            )}
          </>
        )}
      </View>
    </Modal>
  );
};

export default forwardRef(ImageViewerModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  counterContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
  },
  leftButton: {
    left: 20,
  },
  rightButton: {
    right: 20,
  },
});
