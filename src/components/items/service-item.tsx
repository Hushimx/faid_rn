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
        width={70}
        marginLeft="ss"
      >
        <Box
          height={70}
          width={70}
          borderRadius={35}
          alignItems="center"
          justifyContent="center"
          backgroundColor="lightBlue"
          overflow="hidden"
        >
          <AppImage source={{ uri: imageUrl! }} style={styles.img} />
        </Box>
        <AppText 
          numberOfLines={2} 
          marginTop="ss" 
          textAlign="center" 
          style={{ minHeight: 40, width: '100%', textAlign: 'center' }}
        >
          {name}
        </AppText>
      </Box>
    </AppPresseble>
  );
};
export default ServiceItem;

const styles = StyleSheet.create({
  img: { width: '100%', height: '100%', resizeMode: 'cover' },
});
