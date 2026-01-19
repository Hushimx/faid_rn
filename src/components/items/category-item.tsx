import { useNavigation } from '@react-navigation/native';
import { Box, useAppTheme } from 'common';
import {
  AppImage,
  AppLineSeparator,
  AppPresseble,
  AppText,
  UserAvatar,
} from 'components/atoms';
import { AppButton, AppSpacer, BaseModal, Lock } from 'components';
import { EditIcon, LocationPin, Star, Trash } from 'components/icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useChatController } from 'hooks';
import { FC, Fragment, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAuthStore } from 'store';
import { ICategoryItem, IModalRef } from 'types';
import i18n from 'i18n';

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
  onDelete,
  showEditButton = false,
}) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { startChatWithVendor, isStartChatLaoding } = useChatController();
  const { user, isGuestMode, setIsGuestMode } = useAuthStore();
  const { width } = useWindowDimensions();
  const disableChatWithVendor = user?.id === vendorId;
  const loginModalRef = useRef<IModalRef>(null);

  // Helper to extract string from translation object
  const getTranslatedValue = (value: string | { ar: string; en: string } | null | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const currentLang = i18n.language || 'ar';
    return value[currentLang as 'ar' | 'en'] || value.ar || value.en || '';
  };

  const displayTitle = useMemo(() => getTranslatedValue(title), [title]);
  const displayCity = useMemo(() => getTranslatedValue(city), [city]);
  const displayPrice = useMemo(() => price ?? 0, [price]);
  const displayImageUrl = useMemo(() => imageUrl || '', [imageUrl]);
  const displayVendorImageUrl = useMemo(() => vendorImageUrl || '', [vendorImageUrl]);

  const handleMessagePress = () => {
    if (isGuestMode) {
      loginModalRef.current?.openModal();
    } else {
      startChatWithVendor({
        serviceId,
        vendor: {
          id: vendorId,
          name: userName,
          profile_picture: displayVendorImageUrl,
        },
      });
    }
  };

  const handleLoginPress = () => {
    loginModalRef.current?.closeModal();
    setIsGuestMode(false);
  };

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
            height={185}
            borderRadius={10}
            backgroundColor="grayLight"
            alignSelf="center"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            position="relative"
          >
            <AppImage source={{ uri: displayImageUrl }} style={styles.img} />
            {/* City overlay in top right corner */}
            {displayCity && (
              <Box
                position="absolute"
                top={8}
                right={8}
                paddingHorizontal="s"
                paddingVertical="ss"
                borderRadius={6}
                flexDirection="row"
                alignItems="center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
              >
                <LocationPin size={12} color={colors.white} />
                <AppText 
                  variant="s3" 
                  color="white" 
                  marginLeft="ss"
                  fontWeight="bold"
                >
                  {displayCity}
                </AppText>
              </Box>
            )}
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
                {displayTitle}
              </AppText>
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
              {displayPrice} {t('riyal')}
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
                <UserAvatar image={displayVendorImageUrl} />
                <Box marginLeft="s">
                  <AppText color="cutomBlack">{userName}</AppText>
                  <AppText color="customGray">{t('serviceProvider')}</AppText>
                </Box>
              </Box>
              <Box flexDirection="row" alignItems="center">
                {disableChatWithVendor && showEditButton && (
                  <>
                    <AppPresseble
                      onPress={() => navigation.navigate('EditService', { serviceId })}
                    >
                      <Box
                        width={40}
                        height={40}
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor="primary"
                        borderRadius={10}
                        marginRight="s"
                      >
                        <EditIcon size={20} color={colors.white} />
                      </Box>
                    </AppPresseble>
                    {onDelete && (
                      <AppPresseble
                        onPress={() => onDelete(serviceId)}
                      >
                        <Box
                          width={40}
                          height={40}
                          alignItems="center"
                          justifyContent="center"
                          backgroundColor="red"
                          borderRadius={10}
                        >
                          <Trash size={20} color={colors.white} />
                        </Box>
                      </AppPresseble>
                    )}
                  </>
                )}
              {!disableChatWithVendor && (
                <AppPresseble
                  isLoading={isStartChatLaoding && !isGuestMode}
                  onPress={handleMessagePress}
                >
                  <Box
                    width={40}
                    height={40}
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="lightBlue"
                    borderRadius={10}
                  >
                    <FontAwesome5 name="comment-dots" size={20} color={colors.primary} />
                  </Box>
                </AppPresseble>
              )}
              </Box>
            </Box>
          </Fragment>

          <BaseModal ref={loginModalRef}>
            <Box padding="m" alignItems="center">
              <Box marginBottom="l">
                <Lock size={64} color="#464F67" />
              </Box>
              <AppText variant="h6" color="lightBlack" textAlign="center" marginBottom="m">
                {t('loginRequired')}
              </AppText>
              <AppText variant="s1" color="customGray" textAlign="center" marginBottom="xl">
                {t('pleaseLoginToMessageVendor')}
              </AppText>
              <AppButton
                label={t('loginNow')}
                onPress={handleLoginPress}
                isFullWidth
              />
              <AppSpacer variant="s" />
              <AppButton
                label={t('cancel')}
                onPress={() => loginModalRef.current?.closeModal()}
                isFullWidth
                isOutLined
              />
            </Box>
          </BaseModal>

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
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
