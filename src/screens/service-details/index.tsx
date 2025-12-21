import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Box, useAppTheme } from 'common';
import {
  AppHeader,
  AppSlider,
  AppSpacer,
  AppSpaceWrapper,
  AppText,
  Expand,
  LocationPin,
  MapView,
  Star,
} from 'components';
import { LoadingErrorScreenHandler } from 'hoc';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { Comments } from 'screens/show-all-for-category/components';
import { ServicesApis } from 'services';
import {
  IServiceResponse,
  PRICE_TYPE_ENUM,
  QUERIES_KEY_ENUM,
  RootStackParamList,
} from 'types';
import { dataExtractor } from 'utils';
import { ContactOptions, Faqs, ServiceProviderInfo } from './components';
import { RefreshControl } from 'react-native';

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
  const naigation = useNavigation();
  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppHeader label={t('serviceDetails')} />
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
            <AppText variant="h6" color="cutomBlack">
              {DATA?.title}
            </AppText>

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
              <AppText color="primary" variant="s1" fontWeight={'700'}>
                {DATA?.price} {t('riyal')}
              </AppText>

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
            <Box flexDirection="row" width={'100%'}>
              <Box alignItems="center" paddingTop="s">
                <LocationPin color={colors.customGray} />
              </Box>
              <AppText color="customGray" marginLeft="ss">
                {DATA?.address ?? t('noData')}
              </AppText>
            </Box>
            <AppSpacer />
            <Box height={300}>
              <MapView
                region={{
                  latitude: DATA?.lat,
                  longitude: DATA?.lng,
                  latitudeDelta: 0,
                  longitudeDelta: 0,
                }}
                scrollEnabled={false}
              />
              <Box position="absolute" right={10} top={10}>
                <Expand
                  onPress={() =>
                    naigation.navigate('FullScreenMapView', {
                      latitude: DATA?.lat,
                      longitude: DATA?.lng,
                    })
                  }
                />
              </Box>
            </Box>
            <AppSpacer variant="s" />

            <ServiceProviderInfo
              serviceProviderName={DATA?.vendor?.name}
              serviceProviderImage={DATA?.vendor?.profile_picture}
            />
            {/* <AppSpacer variant="s" /> */}

            <Comments serviceId={serviceId} vendorId={DATA?.vendor?.id} />
            <AppSpacer variant="s" />
            {!!DATA?.faqs?.length && <Faqs data={DATA?.faqs} />}
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
