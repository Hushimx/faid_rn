import { useNavigation } from '@react-navigation/native';
import { Box, IMAGES } from 'common';
import {
  AppImage,
  AppPresseble,
  AppSearchInput,
  AppSpacer,
  AppSpaceWrapper,
  CitySelectionSection,
} from 'components';
import { useHomeController } from 'hooks';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { Banners, ServiceList, Services, SpecialOffers } from './components';

const Home = () => {
  const { t } = useTranslation();
  const {
    categories,
    isLoading,
    errorMessage,
    refetch,
    total,
    setSelectedCity,
    selectedCity,
    offers,
    offersLoading,
    banners,
    bannersLoading,
  } = useHomeController();
  const naviagtion = useNavigation();

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginTop="s"
        width={'95%'}
        alignSelf="center"
      >
        <CitySelectionSection
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
        />
        <AppPresseble onPress={() => naviagtion?.navigate('Notifications')}>
          <Box>
            <AppImage source={IMAGES.bell} style={styles.img} />
            {/* Uncomment when notification count API is available */}
            {/* <Box
              position="absolute"
              top={-3}
              left={-8}
              backgroundColor="pageBackground"
              width={23}
              height={23}
              borderRadius={23 / 2}
            >
              <Box
                width={21}
                height={21}
                borderRadius={11}
                backgroundColor="red"
                alignItems="center"
                justifyContent="center"
              >
                <AppText color="white" variant="s3">
                  2
                </AppText>
              </Box>
            </Box> */}
          </Box>
        </AppPresseble>
      </Box>

      <Box
        width={'95%'}
        alignSelf="center"
        marginTop="s"
        marginBottom="s"
      >
        <AppPresseble
          onPress={() =>
            naviagtion?.navigate('ShowAllForCategory', {
              categoryId: 0,
            })
          }
          style={{ pointerEvents: 'box-only' }}
        >
          <AppSearchInput />
        </AppPresseble>
      </Box>

      <ScrollView>
        <AppSpaceWrapper>
          <AppSpacer variant="sm" />
          <Banners banners={banners} />
          <AppSpacer variant="sm" />

          <Services
            categories={categories}
            isLoading={isLoading}
            errorMessage={errorMessage}
            refetch={refetch}
            displayIsShowAll={total > categories?.length}
          />
          <AppSpacer variant="sm" />
          <SpecialOffers offers={offers} />
          <AppSpacer variant="sm" />

          {categories?.map(item => (
            <Box key={item?.name}>
              <ServiceList
                label={item?.name}
                categoryId={item?.id}
                categoryName={item?.name}
                cityId={selectedCity?.id}
              />
              <AppSpacer variant="sm" />
            </Box>
          ))}

          <AppSpacer variant="xl" />
        </AppSpaceWrapper>
      </ScrollView>
    </Box>
  );
};

export default Home;

const styles = StyleSheet.create({
  img: {
    width: 30,
    height: 30,
  },
});
