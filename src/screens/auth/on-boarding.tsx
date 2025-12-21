import { APP_NAME, Box, IMAGES, useAppTheme } from 'common';
import { AppSpacer, AppSpaceWrapper, AppText, IntroSlider } from 'components';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
// import AppIntroSlider from 'react-native-app-intro-slider';
import { useAuthStore } from 'store';
import { AuthFooter } from './components';

const slides = [
  {
    key: 'somethun',
    title: 'Title 1',
    text: 'Description.\nSay something cools',
    image: IMAGES.imageOnboardingOne,
  },
  {
    key: 'somethun-dos',
    title: 'Title 2',
    text: 'Other cool stuff',
    image: IMAGES.imageOnboardingTwo,
  },
  {
    key: 'somethun1',
    title: 'Rocket guy',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image: IMAGES.imageOnboardingThree,
  },
];
type SlideItem = {
  key: string;
  title: string;
  text: string;
  backgroundColor: string;
  image: any;
};

const OnBoarding = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { setIsOnBoarded } = useAuthStore();

  // const sliderRef = useRef<AppIntroSlider | null>(null);

  const _renderItem = ({ item }: { item: SlideItem }) => {
    return (
      <Box alignItems="center" width={'95%'} alignSelf="center">
        <Image style={styles.image} resizeMode="cover" source={item?.image} />
      </Box>
    );
  };

  const handleSkip = () => {
    setIsOnBoarded(true);
  };

  return (
    <Box flex={1}>
      <AppSpaceWrapper>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="sm"
        >
          <AppText variant="s1" color="grayDark">
            {t('welcomeTo')} {APP_NAME}
          </AppText>

          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <AppText variant="s1" color="lightBlack" style={styles.skipText}>
              {t('skip')}
            </AppText>
          </Pressable>
        </Box>

        <AppSpacer variant="s" />
        <Box paddingHorizontal="sm">
          <AppText variant="h1" color="lightBlack">
            {t('sellYourProductsEasily')}
          </AppText>
        </Box>
        <AppSpacer variant="sm" />
        <Box height={550}>
          <IntroSlider
            // ref={sliderRef}
            renderItem={_renderItem}
            data={slides}
            activeDotStyle={{
              backgroundColor: colors.primary,
            }}
            width={Dimensions.get('window').width * 0.95}
          />
          <AppText variant="s1" color="grayDark">
            {t('sellYourProductsEasilyDescription')}
          </AppText>
        </Box>
      </AppSpaceWrapper>
      <AuthFooter
        firstSubLabel={t('alreadyHaveAccount')}
        secondSubLabel={t('login2')}
        onSecondTitlePress={handleSkip}
      />
    </Box>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  image: {
    height: 400,
    width: 400,
    borderRadius: 20,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 27 }, // Using the largest offset
        shadowOpacity: 0.03,
        shadowRadius: 7, // Using the largest radius for a smooth blend
      },
      android: {
        elevation: 4,
      },
    }),
  },
  skipText: {
    textAlign: 'center',
  },
  activeDot: {
    width: 40,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
});
