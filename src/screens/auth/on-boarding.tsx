import { APP_NAME, Box, IMAGES, useAppTheme } from 'common';
import { AppButton, AppSpacer, AppText, IntroSlider } from 'components';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Platform,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { useAuthStore } from 'store';

type SlideItem = {
  key: string;
  title: string;
  text: string;
  image: any;
  /** 0-based index of the word in title to highlight with primary color */
  highlightWordIndex: number;
};

const OnBoarding = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { setIsOnBoarded, loginAsGuest } = useAuthStore();

  const slides: SlideItem[] = [
    {
      key: 'slide-1',
      title: t('onboardingTitle1') || 'Sell your products easily',
      text:
        t('onboardingDescription1') ||
        'Buy and sell easily in one place. Discover products near you and start your experience now.',
      image: IMAGES.onboardingLaunch,
      highlightWordIndex: 0, // "Sell" – matches Launching/start theme
    },
    {
      key: 'slide-2',
      title: t('onboardingTitle2') || 'Find services quickly',
      text:
        t('onboardingDescription2') ||
        'Connect with service providers in your area. Get quality services at your convenience.',
      image: IMAGES.onboardingNavigation,
      highlightWordIndex: 0, // "Find" – matches Navigation/explore theme
    },
    {
      key: 'slide-3',
      title: t('onboardingTitle3') || 'Start your journey',
      text:
        t('onboardingDescription3') ||
        'Join thousands of users. Create your account and explore endless possibilities.',
      image: IMAGES.onboardingPipeline,
      highlightWordIndex: 0, // "Start" – matches Pipeline/service/journey theme
    },
  ];

  const _renderItem = ({ item, index }: { item: SlideItem; index: number }) => {
    const isLastSlide = index === slides.length - 1;

    return (
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
        paddingHorizontal="m"
        width="100%"
      >
        {/* Image Container - marginBottom xxl (40) to match HTML */}
        <Box
          alignItems="center"
          justifyContent="center"
          marginBottom="xxl"
          width="100%"
        >
          <Image
            style={styles.image}
            resizeMode="contain"
            source={item.image}
          />
        </Box>

        {/* Text Container - paddingTop prevents Arabic text clipping from top */}
        <Box
          alignItems="center"
          justifyContent="center"
          width="100%"
          paddingHorizontal="sm"
          paddingTop="m"
        >
          <AppText
            variant="h1"
            style={styles.title}
            textAlign="center"
          >
            {(() => {
              const words = item.title.split(/\s+/);
              return words.map((word, i) => (
                <Text
                  key={i}
                  style={{
                    color:
                      i === item.highlightWordIndex
                        ? colors.primary
                        : colors.lightBlack,
                  }}
                >
                  {word}
                  {i < words.length - 1 ? ' ' : ''}
                </Text>
              ));
            })()}
          </AppText>

          <AppSpacer variant="sm" />

          <AppText
            variant="s1"
            color="grayDark"
            style={styles.description}
            textAlign="center"
          >
            {item.text}
          </AppText>

          {/* Buttons - Only on last slide, xxl (40) to match HTML */}
          {isLastSlide && (
            <>
              <AppSpacer variant="xxl" />
              <Box width="100%" paddingHorizontal="m">
                <AppButton
                  label={t('startNow')}
                  onPress={handleSkip}
                  isFullWidth
                />
                <AppSpacer variant="s" />
                <AppButton
                  label={t('continueAsGuest')}
                  onPress={handleGuestLogin}
                  isFullWidth
                  isOutLined
                />
              </Box>
              <AppSpacer variant="s" />

            </>
          )}
        </Box>
      </Box>
    );
  };

  const handleSkip = () => {
    setIsOnBoarded(true);
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    setIsOnBoarded(true);
  };

  return (
    <Box flex={1} backgroundColor="white">
      {/* Header with Skip Button */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="m"
        paddingTop="l"
        paddingBottom="m"
      >
        <AppText variant="s1" color="grayDark">
          {t('welcomeTo')} {APP_NAME}
        </AppText>


      </Box>

      {/* Slider Container */}
      <Box flex={1} paddingBottom="xxl">
        <IntroSlider
          renderItem={_renderItem}
          data={slides}
          activeDotStyle={{
            backgroundColor: colors.primary,
          }}
          width={Dimensions.get('window').width}
        />
      </Box>

      {/* Footer */}
      <Box
        position="absolute"
        bottom={0}
        width={'100%'}
        alignItems="center"
        justifyContent="center"
        paddingBottom="l"
      >

        <AppSpacer variant="s" />

      </Box>
    </Box>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').height * 0.28,
    maxWidth: 320,
    maxHeight: 320,
  },
  title: {
    fontWeight: 'bold',
    lineHeight: 42,
    paddingTop: Platform.OS === 'android' ? 4 : 0,
    ...(Platform.OS === 'android' && { includeFontPadding: true }),
  },
  description: {
    lineHeight: 26,
    paddingTop: Platform.OS === 'android' ? 2 : 0,
    ...(Platform.OS === 'android' && { includeFontPadding: true }),
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  skipText: {
    textAlign: 'center',
  },
});
