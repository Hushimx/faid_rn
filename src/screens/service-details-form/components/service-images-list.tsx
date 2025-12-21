import { Box, useAppTheme } from 'common';
import {
  AppImage,
  AppList,
  AppPresseble,
  CloseCircle,
  Plus,
} from 'components';
import { Asset } from 'react-native-image-picker';
import { StyleSheet } from 'react-native';

type Props = {
  serviceMedia: Asset[];
  onDeleteServiceImage: (index: number) => void;
  onUploadServiceImages: () => void;
};

const ServiceImagesList = ({
  serviceMedia,
  onDeleteServiceImage,
  onUploadServiceImages,
}: Props) => {
  const { colors } = useAppTheme();

  const isVideo = (item: Asset) => {
    return item?.type?.startsWith('video/');
  };

  return (
    <Box>
      <AppList
        data={serviceMedia}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item, index }) => (
          <Box>
            <Box width={100} height={100}>
              {!isVideo(item) && (
                <AppImage
                  style={styles.mediaItem}
                  source={{ uri: item?.uri }}
                />
              )}
              {/* Video Play Icon Overlay */}
              {isVideo(item) && (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  alignItems="center"
                  justifyContent="center"
                  borderRadius={10}
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                  <Box
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor="white"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box
                      width={0}
                      height={0}
                      style={{
                        borderLeftWidth: 12,
                        borderTopWidth: 8,
                        borderBottomWidth: 8,
                        borderLeftColor: colors.primary,
                        borderTopColor: 'transparent',
                        borderBottomColor: 'transparent',
                        marginLeft: 3,
                      }}
                    />
                  </Box>
                </Box>
              )}
              <Box position="absolute" top={0} right={1}>
                <CloseCircle
                  size={20}
                  onPress={() => onDeleteServiceImage(index)}
                />
              </Box>
            </Box>
          </Box>
        )}
        ListFooterComponent={() =>
          serviceMedia?.length < 5 && (
            <AppPresseble onPress={onUploadServiceImages}>
              <Box
                width={100}
                height={100}
                alignItems="center"
                justifyContent="center"
                borderWidth={1}
                borderColor="grayDark"
                borderRadius={10}
              >
                <Plus color={colors.grayDark} />
              </Box>
            </AppPresseble>
          )
        }
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  mediaItem: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default ServiceImagesList;
