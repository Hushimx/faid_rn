import { useNavigation } from '@react-navigation/native';
import { Box, useAppTheme } from 'common';
import {
  AppImage,
  AppLineSeparator,
  AppPresseble,
  AppText,
  UserAvatar,
} from 'components/atoms';
import { LocationPin, MessageIcon, Star } from 'components/icons';
import { useChatController } from 'hooks';
import { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAuthStore } from 'store';
import { ICategoryItem } from 'types';

const CategoryItem: FC<ICategoryItem> = ({
  title,
  price,
  userName,
  serviceId,
  index,
  vendorId,
  imageUrl,
  reviewCount,
  rating,
  vendorImageUrl,
  style,
  city,
}) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { startChatWithVendor, isStartChatLaoding } = useChatController();
  const { user } = useAuthStore();
  const { width } = useWindowDimensions();
  const disableChatWithVendor = user?.id == vendorId;

  return (
    <Animated.View entering={FadeIn.delay(index * 100)} style={{ flex: 1 }}>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => navigation.navigate('ServiceDetails', { serviceId })}
      >
        <Box
          flex={1}
          backgroundColor="white"
          borderRadius={10}
          style={style}
          paddingBottom="s"
          minWidth={width * 0.5}
        >
          <Box
            width={'100%'}
            borderRadius={10}
            paddingVertical="s"
            backgroundColor="grayLight"
            alignSelf="center"
            alignItems="center"
          >
            <AppImage source={{ uri: imageUrl }} style={styles.img} />
          </Box>

          <Box width={'95%'} alignSelf="center">
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              paddingTop="s"
              flexWrap="wrap"
            >
              <AppText fontWeight={'400'} color="cutomBlack">
                {title}
              </AppText>
              {city && (
                <Box flexDirection="row" alignItems="center">
                  <LocationPin color={colors.customGray} />
                  <AppText color="customGray">{city}</AppText>
                </Box>
              )}
            </Box>

            <Box flexDirection="row" alignItems="center">
              <Star color={colors.customYellow} />
              <AppText color="customGray" marginLeft="ss">
                ({rating}/5) | {reviewCount} {t('review')}
              </AppText>
            </Box>
            <AppText
              color="primary"
              variant="s1"
              marginLeft="ss"
              fontWeight={'700'}
            >
              {price} {t('riyal')}
            </AppText>
          </Box>

          <Fragment>
            <AppLineSeparator />
            <Box
              flexDirection="row"
              alignItems="center"
              marginTop="s"
              width={'95%'}
              alignSelf="center"
              justifyContent="space-between"
            >
              <Box flexDirection="row" justifyContent="center">
                <UserAvatar image={vendorImageUrl} />
                <Box marginLeft="s">
                  <AppText color="cutomBlack">{userName}</AppText>
                  <AppText color="customGray">{t('serviceProvider')}</AppText>
                </Box>
              </Box>
              {!disableChatWithVendor && (
                <AppPresseble
                  isLoading={isStartChatLaoding}
                  onPress={() =>
                    startChatWithVendor({
                      serviceId,
                      vendor: {
                        id: vendorId,
                        name: userName,
                        profile_picture: vendorImageUrl,
                      },
                    })
                  }
                >
                  <Box
                    width={40}
                    height={40}
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="lightBlue"
                    borderRadius={10}
                  >
                    <MessageIcon size={30} />
                  </Box>
                </AppPresseble>
              )}
            </Box>
          </Fragment>

          {/* {showComments && (
            <Box>
              <AppLineSeparator />
              <Comments />
            </Box>
          )} */}
        </Box>
      </Pressable>
    </Animated.View>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  img: {
    width: '95%',
    height: 185,
    borderRadius: 10,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
