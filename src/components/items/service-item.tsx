import { useNavigation } from '@react-navigation/native';
import { Box } from 'common';
import { AppImage, AppPresseble, AppText } from 'components/atoms';
import { FC } from 'react';
import { StyleSheet } from 'react-native';
import { IServiceItem } from 'types';

const ServiceItem: FC<IServiceItem> = ({
  name,
  imageUrl,
  categoryId,
  categoryName,
}) => {
  const navigation = useNavigation();
  return (
    <AppPresseble
      onPress={() =>
        navigation.navigate('ShowAllForCategory', {
          categoryId,
          categoryName,
        })
      }
    >
      <Box
        alignItems="center"
        justifyContent="center"
        width={80}
        marginLeft="ss"
      >
        <Box
          height={80}
          width={90}
          borderRadius={10}
          alignItems="center"
          justifyContent="center"
          backgroundColor="lightBlue"
        >
          <AppImage source={{ uri: imageUrl! }} style={styles.img} />
        </Box>
        <AppText numberOfLines={1}>{name}</AppText>
      </Box>
    </AppPresseble>
  );
};
export default ServiceItem;

const styles = StyleSheet.create({
  img: { width: 50, height: 50, resizeMode: 'contain' },
});
