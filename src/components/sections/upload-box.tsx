import { Box, IMAGES } from 'common';
import { AppImage, AppPresseble, AppText } from '../atoms';
import { ImageSourcePropType, StyleSheet } from 'react-native';

const UplaodBox = ({
  title,
  subTitle,
  onPress,
  image,
  isError,
}: {
  title: string;
  subTitle: string;
  onPress: () => void;
  image?: ImageSourcePropType;
  isError?: boolean;
}) => {
  return (
    <AppPresseble onPress={onPress}>
      <Box
        width={'95%'}
        alignSelf="center"
        height={300}
        alignItems="center"
        justifyContent="center"
        borderStyle="dashed"
        borderWidth={2}
        borderRadius={10}
        borderColor={isError ? 'red' : 'grayLight'}
      >
        <AppImage
          source={image ?? IMAGES.upload}
          style={image ? styles.img : styles.smallImage}
        />
        <AppText marginTop="s">{title}</AppText>
        <AppText color="grayDark">{subTitle}</AppText>
      </Box>
    </AppPresseble>
  );
};

export default UplaodBox;

const styles = StyleSheet.create({
  img: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  smallImage: {
    width: 100,
    height: 100,
  },
});
