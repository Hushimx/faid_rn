import { useNavigation } from '@react-navigation/native';
import { Box } from 'common';
import {
  AppPresseble,
  AppSearchInput,
  AppSpacer,
  AppSpaceWrapper,
  CitySelectionSection,
} from 'components';
import { useHomeController } from 'hooks';
import { ScrollView } from 'react-native';
import { Banners, ServiceList, Services } from './components';

const Home = () => {
  const {
    categories,
    isLoading,
    errorMessage,
    refetch,
    total,
    setSelectedCity,
    selectedCity,
    banners,
  } = useHomeController();
  const naviagtion = useNavigation();

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <Box
        marginTop="s"
        width={'95%'}
        alignSelf="center"
      >
        <CitySelectionSection
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
        />
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
