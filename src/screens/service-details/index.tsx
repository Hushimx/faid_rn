import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, SPACING, useAppTheme } from 'common';
import {
  AppHeader,
  AppSlider,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  CategoryItem,
  LocationPin,
  ServiceDetailsSkeleton,
  Star,
} from 'components';
import { AppPresseble } from 'components/atoms';
import { EditIcon } from 'components/icons';
import { LoadingErrorFlatListHandler, LoadingErrorScreenHandler } from 'hoc';
import i18n from 'i18n';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Linking,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Comments } from 'screens/show-all-for-category/components';
import { ServicesApis } from 'services';
import { useAuthStore } from 'store';
import { ShowSnackBar } from 'utils';
import {
  IServiceResponse,
  PRICE_TYPE_ENUM,
  QUERIES_KEY_ENUM,
  RootStackParamList,
} from 'types';
import { dataExtractor } from 'utils';
import { ContactOptions, Faqs, ServiceProviderInfo } from './components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const CONTENT_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const IMAGE_HEIGHT = CONTENT_WIDTH * (10 / 16);

const MIN_LOADING_MS = 1000;

function getTranslatedValue(
  value: string | { ar: string; en: string } | null | undefined,
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const lang = i18n.language || 'ar';
  return value[lang as 'ar' | 'en'] || value.ar || value.en || '';
}

const ServiceDetails = (
  props: NativeStackScreenProps<RootStackParamList, 'ServiceDetails'>,
) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { serviceId } = props?.route?.params || {};
  const { data, isPending, isError, refetch, error, isRefetching } = useQuery<
    any,
    any,
    IServiceResponse
  >({
    queryFn: () => ServicesApis.getService({ serviceId }),
    queryKey: [QUERIES_KEY_ENUM.service_details, serviceId],
  });
  const DATA = dataExtractor<IServiceResponse>(data) || {};
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const isServiceOwner = user?.id === DATA?.vendor?.id;

  const [minLoadingElapsed, setMinLoadingElapsed] = useState(false);
  const showSkeleton = isPending || !minLoadingElapsed;

  useEffect(() => {
    const timer = setTimeout(() => setMinLoadingElapsed(true), MIN_LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  const mediaData = useMemo(
    () => [...(DATA?.images ?? []), ...(DATA?.videos ?? [])],
    [DATA?.images, DATA?.videos],
  );
  const displayTitle = useMemo(
    () => getTranslatedValue(DATA?.title),
    [DATA?.title],
  );
  const displayDescription = useMemo(
    () => getTranslatedValue(DATA?.description),
    [DATA?.description],
  );
  const displayCity = useMemo(
    () => getTranslatedValue(DATA?.city),
    [DATA?.city],
  );

  const queryClient = useQueryClient();
  const isFavorited = DATA?.is_favorited ?? false;
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        return ServicesApis.removeFavorite(serviceId);
      }
      return ServicesApis.addFavorite(serviceId);
    },
    onSuccess: () => {
      queryClient.setQueryData(
        [QUERIES_KEY_ENUM.service_details, serviceId],
        (old: any) => {
          if (!old?.data?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: { ...old.data.data, is_favorited: !isFavorited },
            },
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: [QUERIES_KEY_ENUM.favorites],
      });
    },
    onError: () => {
      ShowSnackBar({
        text: t('errors.networkError') || 'Something went wrong',
        type: 'error',
      });
    },
  });

  const handleFavoritePress = useCallback(() => {
    if (!user) {
      ShowSnackBar({
        text: t('loginToAddFavorites') || t('loginRequired') || 'Please login to add favorites',
        type: 'error',
      });
      return;
    }
    toggleFavorite();
  }, [user, toggleFavorite, t]);

  const {
    data: relatedServicesData,
    isPending: isRelatedServicesPending,
    isError: isRelatedServicesError,
    refetch: refetchRelatedServices,
    error: relatedServicesError,
  } = useQuery<any, any, any>({
    queryFn: () => ServicesApis.getRelatedServices({ serviceId }),
    queryKey: [QUERIES_KEY_ENUM.related_services, serviceId],
    enabled: !!serviceId && !!DATA?.id,
  });
  const RELATED_SERVICES = dataExtractor<any[]>(relatedServicesData) || [];

  const reviewCount = DATA?.reviews_count ?? DATA?.reviews?.length ?? 0;

  if (isError) {
    return (
      <LoadingErrorScreenHandler
        loading={false}
        refetch={refetch}
        errorMessage={error?.message}
        isError={isError}
      >
        <View />
      </LoadingErrorScreenHandler>
    );
  }

  if (showSkeleton) {
    return <ServiceDetailsSkeleton />;
  }

  return (
    <Box flex={1} backgroundColor="pageBackground">
      {/* Header: chevron + title, edit button (HTML: white bg, shadow, circular) */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="m"
        paddingVertical="m"
      >
        <Box flex={1}>
          <AppHeader label={t('serviceDetails')} />
        </Box>
        {isServiceOwner && (
          <AppPresseble
            onPress={() => navigation.navigate('EditService', { serviceId })}
          >
            <Box
              width={40}
              height={40}
              alignItems="center"
              justifyContent="center"
              backgroundColor="white"
              borderRadius={20}
              marginLeft="s"
              style={styles.editButton}
            >
              <EditIcon size={20} color={colors.primary} />
            </Box>
          </AppPresseble>
        )}
      </Box>

      <ScrollView
        nestedScrollEnabled
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Box paddingHorizontal="m">
          {/* Image slider: 16:10 aspect, rounded-3xl, badge bottom-left dark overlay */}
          {mediaData.length > 0 ? (
            <Box
              marginBottom="l"
              borderRadius={24}
              overflow="hidden"
              style={styles.imageWrapper}
            >
              <AppSlider
                data={mediaData}
                height={IMAGE_HEIGHT}
                aspectRatio={16 / 10}
                borderRadius={24}
                badgePosition="left"
                badgeVariant="dark"
                fullWidthWithPadding
              />
            </Box>
          ) : (
            <Box
              height={IMAGE_HEIGHT}
              marginBottom="l"
              borderRadius={24}
              backgroundColor="grayLight"
              overflow="hidden"
            />
          )}

          {/* Title section: 3xl bold, rating (amber star), favorite */}
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-start"
            marginBottom="l"
          >
            <Box flex={1}>
              <AppText variant="h1" color="cutomBlack" fontWeight="700">
                {displayTitle || t('noData')}
              </AppText>
              <Box flexDirection="row" alignItems="center" marginTop="s">
                <Star color="#F59E0B" />
                <AppText marginLeft="s" fontWeight="700" color="cutomBlack">
                  {DATA?.rating ?? 0}
                </AppText>
                <AppText marginLeft="ss" color="customGray" variant="s2">
                  ({reviewCount} {t('review')})
                </AppText>
              </Box>
            </Box>
            <Box flexDirection="row" alignItems="center" flex={1} justifyContent="flex-end">
   
              <AppPresseble
                onPress={handleFavoritePress}
                disabled={isTogglingFavorite}
              >
                <Box
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor="grayLight"
                  alignItems="center"
                  justifyContent="center"
                >
                  <MaterialIcons
                    name={isFavorited ? 'favorite' : 'favorite-border'}
                    size={22}
                    color="#F43F5E"
                  />
                </Box>
              </AppPresseble>
            </Box>
          </Box>

          {DATA?.price != null && DATA?.price > 0 && (
            <Box flexDirection="row" alignItems="center" marginBottom="s">
              <AppText color="primary" variant="s1" fontWeight="700">
                {DATA.price} {t('riyal')}
              </AppText>
              {PRICE_TYPE_ENUM.negotiable === DATA?.price_type && (
                <AppText marginLeft="s" color="customGray" variant="s2">
                  {t('negotiable')}
                </AppText>
              )}
            </Box>
          )}

          {/* Description section */}
          <Box marginBottom="l">
            <AppText variant="m" fontWeight="700" color="cutomBlack" marginBottom="s">
              {t('description')}
            </AppText>
            <AppText
              color="customGray"
              variant="s2"
              style={styles.descriptionText}
            >
              {displayDescription || t('noData')}
            </AppText>
          </Box>

          {/* Location section */}
          <Box marginBottom="l">
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              marginBottom="s"
            >
              <AppText variant="m" fontWeight="700" color="cutomBlack">
                {t('location')}
              </AppText>
              <Box flexDirection="row" alignItems="center">
                <LocationPin color={colors.primary} size={18} />
                <AppText
                  marginLeft="ss"
                  color="primary"
                  variant="s2"
                  fontWeight="600"
                >
                  {displayCity || t('noData')}
                </AppText>
              </Box>
            </Box>

            {DATA?.lat != null &&
            DATA?.lng != null &&
            typeof DATA.lat === 'number' &&
            typeof DATA.lng === 'number' &&
            !isNaN(DATA.lat) &&
            !isNaN(DATA.lng) ? (
              <Box
                height={192}
                borderRadius={16}
                overflow="hidden"
                style={styles.mapContainer}
              >
                <MapView
                  key={`${DATA.lat}-${DATA.lng}`}
                  style={StyleSheet.absoluteFill}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={{
                    latitude: DATA.lat,
                    longitude: DATA.lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: DATA.lat,
                      longitude: DATA.lng,
                    }}
                  />
                </MapView>
                <Box position="absolute" top={12} left={12}>
                  <AppPresseble
                    onPress={() =>
                      navigation.navigate('FullScreenMapView', {
                        latitude: DATA.lat!,
                        longitude: DATA.lng!,
                      })
                    }
                  >
                    <Box
                      padding="s"
                      borderRadius={8}
                      style={styles.fullscreenButton}
                    >
                      <MaterialIcons
                        name="fullscreen"
                        size={20}
                        color={colors.lightBlack}
                      />
                    </Box>
                  </AppPresseble>
                </Box>
                <Box
                  position="absolute"
                  bottom={12}
                  left={12}
                  right={12}
                  alignItems="flex-end"
                >
                  <AppPresseble
                    onPress={() => {
                      const url =
                        Platform.select({
                          ios: `maps://maps.apple.com/?q=${DATA.lat},${DATA.lng}`,
                          android: `geo:${DATA.lat},${DATA.lng}?q=${DATA.lat},${DATA.lng}`,
                        }) ||
                        `https://maps.google.com/?q=${DATA.lat},${DATA.lng}`;
                      Linking.openURL(url).catch(err =>
                        console.log('Error opening maps:', err),
                      );
                    }}
                  >
                    <Box
                      width={48}
                      height={48}
                      backgroundColor="white"
                      borderRadius={24}
                      alignItems="center"
                      justifyContent="center"
                      style={styles.locationPin}
                    >
                      <LocationPin color={colors.primary} size={24} />
                    </Box>
                  </AppPresseble>
                </Box>
              </Box>
            ) : (
              <Box
                height={192}
                alignItems="center"
                justifyContent="center"
                backgroundColor="grayLight"
                borderRadius={16}
              >
                <AppText color="customGray" variant="s2">
                  {t('noLocationAvailable') || 'Location not available'}
                </AppText>
              </Box>
            )}
          </Box>
        </Box>

        <AppSpaceWrapper>
          <ServiceProviderInfo
            serviceProviderName={DATA?.vendor?.name}
            serviceProviderImage={DATA?.vendor?.profile_picture}
            onPress={() => {
              if (DATA?.vendor?.id) {
                navigation.navigate('VendorStore', { vendorId: DATA.vendor.id });
              }
            }}
          />

          <Comments serviceId={serviceId} vendorId={DATA?.vendor?.id} />
          <AppSpacer variant="s" />
          {!!DATA?.faqs?.length && <Faqs data={DATA?.faqs} />}
          <AppSpacer variant="s" />

          {RELATED_SERVICES.length > 0 && (
            <>
              <AppText
                variant="h6"
                color="cutomBlack"
                fontWeight="700"
                marginBottom="s"
              >
                {t('relatedServices')}
              </AppText>
              <LoadingErrorFlatListHandler
                loading={isRelatedServicesPending}
                refetch={refetchRelatedServices}
                isError={isRelatedServicesError}
                errorMessage={relatedServicesError?.message}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: SPACING.gap,
                  paddingHorizontal: SPACING.gap,
                }}
                decelerationRate="fast"
                bounces={false}
                data={RELATED_SERVICES}
                renderItem={({ item, index }) => (
                  <CategoryItem
                    index={index}
                    title={item?.title}
                    userName={item?.vendor?.name}
                    serviceId={item?.id}
                    price={item?.price}
                    vendorId={item?.vendor?.id}
                    vendorImageUrl={item?.vendor?.profile_picture}
                    imageUrl={item?.primary_image?.url}
                    reviewCount={item?.reviews_count || 0}
                    rating={item?.rating || 0}
                    style={{ maxWidth: SPACING.xxl * 2 }}
                    city={item?.city}
                  />
                )}
              />
              <AppSpacer variant="s" />
            </>
          )}

          <AppSpacer variant="xxl" />
          <AppSpacer variant="xxl" />
        </AppSpaceWrapper>

        {/* Bottom pill indicator */}
        <Box
          flexDirection="row"
          justifyContent="center"
          paddingVertical="s"
          marginBottom="xl"
        >
          <Box
            width={128}
            height={6}
            borderRadius={3}
            backgroundColor="grayLight"
          />
        </Box>
      </ScrollView>

      <ContactOptions vendor={DATA?.vendor} serviceId={serviceId} />
    </Box>
  );
};

const styles = StyleSheet.create({
  editButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  descriptionText: {
    lineHeight: 22,
  },
  mapContainer: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  locationPin: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullscreenButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ServiceDetails;
