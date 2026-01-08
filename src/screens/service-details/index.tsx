import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Box, SPACING, useAppTheme } from 'common';
import {
  AppHeader,
  AppSlider,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  CategoryItem,
  Expand,
  LocationPin,
  Star,
} from 'components';
import { AppPresseble } from 'components/atoms';
import { EditIcon } from 'components/icons';
import { LoadingErrorFlatListHandler, LoadingErrorScreenHandler } from 'hoc';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Comments } from 'screens/show-all-for-category/components';
import { ServicesApis } from 'services';
import { useAuthStore } from 'store';
import {
  IServiceResponse,
  PRICE_TYPE_ENUM,
  QUERIES_KEY_ENUM,
  RootStackParamList,
} from 'types';
import { dataExtractor } from 'utils';
import { ContactOptions, Faqs, ServiceProviderInfo } from './components';
import { RefreshControl, Linking, Platform } from 'react-native';

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

  // Fetch related services
  const {
    data: relatedServicesData,
    isPending: isRelatedServicesPending,
    isError: isRelatedServicesError,
    refetch: refetchRelatedServices,
    error: relatedServicesError,
  } = useQuery<any, any, any>({
    queryFn: () => ServicesApis.getRelatedServices({ serviceId }),
    queryKey: [QUERIES_KEY_ENUM.related_services, serviceId],
    enabled: !!serviceId && !!DATA?.id, // Only fetch when service data is loaded
  });
  const RELATED_SERVICES = dataExtractor<any[]>(relatedServicesData) || [];
  
  return (
    <Box flex={1} backgroundColor="pageBackground">
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" paddingRight="m">
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
              backgroundColor="primary"
              borderRadius={10}
              marginLeft="s"
            >
              <EditIcon size={20} color={colors.white} />
            </Box>
          </AppPresseble>
        )}
      </Box>
      <LoadingErrorScreenHandler
        loading={isPending}
        refetch={refetch}
        errorMessage={error?.message}
        isError={isError}
      >
        <ScrollView
          nestedScrollEnabled
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        >
          <AppSpaceWrapper>
            <AppSlider
              data={[...(DATA?.images ?? []), ...(DATA?.videos ?? [])]}
            />

            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <AppText variant="h6" color="cutomBlack" flex={1}>
                {DATA?.title}
              </AppText>
              <AppText color="primary" variant="s1" fontWeight={'700'}>
                {DATA?.price} {t('riyal')}
              </AppText>
            </Box>

            <Box flexDirection="row" alignItems="center">
              <Star color={colors.customYellow} />
              <AppText ml="s" color="customGray">
                ({DATA?.rating}/5) | {DATA?.reviews?.length} {t('review')}
              </AppText>
            </Box>
            <AppSpacer variant="s" />
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >


              {PRICE_TYPE_ENUM.negotiable === DATA?.price_type && (
                <AppText color="cutomBlack">
                  {/* {t('period')}:{' '} */}
                  <AppText color="customGray">{t('negotiable')}</AppText>
                </AppText>
              )}
            </Box>
            <AppSpacer variant="s" />

            <AppText fontWeight={'700'} color="cutomBlack">
              {t('description')}
            </AppText>
            <AppText color="customGray">
              {DATA?.description ?? t('noData')}
            </AppText>
            <AppSpacer variant="s" />

            <AppText fontWeight={'700'} color="cutomBlack">
              {t('location')}
            </AppText>
            <Box flexDirection="row" width={'100%'} />
            <Box flexDirection="row" alignItems="center">
                <LocationPin color={colors.customGray} size={14} />
                <AppText color="customGray" marginLeft="ss">
                  {DATA?.city}
                </AppText>
              </Box>
            <AppSpacer />
            {DATA?.lat != null && DATA?.lng != null && 
             typeof DATA.lat === 'number' && typeof DATA.lng === 'number' &&
             !isNaN(DATA.lat) && !isNaN(DATA.lng) ? (
              <Box height={300}>
                <MapView
                  key={`${DATA.lat}-${DATA.lng}`}
                  style={{ flex: 1 }}
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
                <Box position="absolute" style={{ right: 10, top: 10 }}>
                  <Expand
                    onPress={() =>
                      navigation.navigate('FullScreenMapView', {
                        latitude: DATA.lat!,
                        longitude: DATA.lng!,
                      })
                    }
                  />
                </Box>
                
                <Box position="absolute" style={{ left: 10, bottom: 10 }}>
                  
                  <AppPresseble
                    onPress={() => {
                      const url = Platform.select({
                        ios: `maps://maps.apple.com/?q=${DATA.lat},${DATA.lng}`,
                        android: `geo:${DATA.lat},${DATA.lng}?q=${DATA.lat},${DATA.lng}`,
                      }) || `https://maps.google.com/?q=${DATA.lat},${DATA.lng}`;
                      Linking.openURL(url).catch(err => console.log('Error opening maps:', err));
                    }}
                  >
                    <Box
                      width={48}
                      height={48}
                      backgroundColor="white"
                      borderRadius={24}
                      alignItems="center"
                      justifyContent="center"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}
                    >
                      <LocationPin color={colors.primary} size={24} />
                    </Box>
                  </AppPresseble>
                </Box>
              </Box>
            ) : (
              <Box height={300} alignItems="center" justifyContent="center" backgroundColor="customGray" opacity={0.3}>
                <AppText color="customGray">{t('noLocationAvailable') || 'Location not available'}</AppText>
              </Box>
            )}
            <AppSpacer variant="s" />

            <ServiceProviderInfo
              serviceProviderName={DATA?.vendor?.name}
              serviceProviderImage={DATA?.vendor?.profile_picture}
              onPress={() => {
                if (DATA?.vendor?.id) {
                  navigation.navigate('VendorStore', { vendorId: DATA.vendor.id });
                }
              }}
            />
            {/* <AppSpacer variant="s" /> */}

            <Comments serviceId={serviceId} vendorId={DATA?.vendor?.id} />
            <AppSpacer variant="s" />
            {!!DATA?.faqs?.length && <Faqs data={DATA?.faqs} />}
            <AppSpacer variant="s" />
            
            {/* Related Services Section */}
            {RELATED_SERVICES.length > 0 && (
              <>
                <AppText variant="h6" color="cutomBlack" fontWeight="700" marginBottom="s">
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
        </ScrollView>

        <ContactOptions vendor={DATA?.vendor} serviceId={serviceId} />
      </LoadingErrorScreenHandler>
    </Box>
  );
};
export default ServiceDetails;
