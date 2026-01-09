import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useBottomSheetBackHandler } from '@hooks';
import { Box, SPACING, useAppTheme } from 'common';
import { AppText } from 'components/atoms';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface SuccessBottomSheetProps {
  title?: string;
  subtitle?: string;
  onDismiss?: () => void;
}

export interface SuccessBottomSheetRef {
  present: (_message: string, _title?: string, _subtitle?: string) => void;
  dismiss: () => void;
}

const SuccessBottomSheet = forwardRef<SuccessBottomSheetRef, SuccessBottomSheetProps>(
  ({ onDismiss }, ref) => {
    const { colors } = useAppTheme();
    const { bottom } = useSafeAreaInsets();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const messageRef = useRef<string>('');
    const titleRef = useRef<string | undefined>(undefined);
    const subtitleRef = useRef<string | undefined>(undefined);
    const autoDismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Animation values
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const checkmarkAnim = useRef(new Animated.Value(0)).current;

    const { handleSheetPositionChange } = useBottomSheetBackHandler(bottomSheetRef);

    useImperativeHandle(ref, () => ({
      present: (msg: string, title?: string, subtitle?: string) => {
        messageRef.current = msg;
        titleRef.current = title;
        subtitleRef.current = subtitle;
        bottomSheetRef.current?.present();

        // Start animations
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 3,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(checkmarkAnim, {
            toValue: 1,
            useNativeDriver: true,
            delay: 200,
            tension: 50,
            friction: 3,
          }),
        ]).start();

        // Auto-dismiss after 3 seconds
        if (autoDismissTimeoutRef.current) {
          clearTimeout(autoDismissTimeoutRef.current);
        }
        autoDismissTimeoutRef.current = setTimeout(() => {
          bottomSheetRef.current?.dismiss();
        }, 3000);
      },
      dismiss: () => {
        if (autoDismissTimeoutRef.current) {
          clearTimeout(autoDismissTimeoutRef.current);
          autoDismissTimeoutRef.current = null;
        }
        bottomSheetRef.current?.dismiss();
      },
    }));

    useEffect(() => {
      return () => {
        if (autoDismissTimeoutRef.current) {
          clearTimeout(autoDismissTimeoutRef.current);
        }
      };
    }, []);

    const handleDismiss = useCallback(() => {
      if (autoDismissTimeoutRef.current) {
        clearTimeout(autoDismissTimeoutRef.current);
        autoDismissTimeoutRef.current = null;
      }

      // Reset animations
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss?.();
      });
    }, [onDismiss, scaleAnim, opacityAnim, checkmarkAnim]);

    const renderBackDrop = useCallback(
      (props: any) => {
        return (
          <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            onPress={props?.onPress}
            pressBehavior="close"
            {...props}
          />
        );
      },
      [],
    );

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        enableDynamicSizing
        enablePanDownToClose={true}
        onChange={handleSheetPositionChange}
        index={0}
        handleIndicatorStyle={{
          backgroundColor: colors.grayLight,
          width: 100,
        }}
        backdropComponent={renderBackDrop}
        enableDismissOnClose
        onDismiss={handleDismiss}
      >
        <BottomSheetView
          style={[
            styles.container,
            {
              paddingBottom: bottom + SPACING.m,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Success Icon with Animation */}
            <Box alignItems="center" marginBottom="l">
              <Animated.View
                style={[
                  styles.iconContainer,
                  {
                    transform: [{ scale: checkmarkAnim }],
                  },
                ]}
              >
                <Box
                  width={80}
                  height={80}
                  borderRadius={40}
                  backgroundColor="success"
                  alignItems="center"
                  justifyContent="center"
                  style={styles.iconShadow}
                >
                  <AntDesign name="check" size={40} color={colors.white} />
                </Box>
              </Animated.View>

              {/* Success particles effect */}
              <Box position="absolute" top={10}>
                {[...Array(6)].map((_, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.particle,
                      {
                        transform: [
                          {
                            rotate: `${index * 60}deg`,
                          },
                          {
                            translateX: checkmarkAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 25],
                            }),
                          },
                          {
                            translateY: checkmarkAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -25],
                            }),
                          },
                        ],
                        opacity: checkmarkAnim,
                      },
                    ]}
                  />
                ))}
              </Box>
            </Box>

            {/* Title - Always show */}
            <AppText
              variant="h4"
              color="darkSlateBlue"
              fontWeight="700"
              textAlign="center"
              marginBottom="s"
            >
              {titleRef.current || 'Success!'}
            </AppText>

            {/* Message */}
            <AppText variant="s1" color="darkSlateBlue" textAlign="center" marginBottom="s">
              {messageRef.current}
            </AppText>

            {/* Subtitle - Always show */}
            <AppText variant="s3" color="grayDark" textAlign="center">
              {subtitleRef.current || 'Your action has been completed successfully'}
            </AppText>
          </Animated.View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

SuccessBottomSheet.displayName = 'SuccessBottomSheet';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.m,
  },
  animatedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.m,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconShadow: {
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#34C759',
    top: 20,
    left: 38,
  },
});

export default SuccessBottomSheet;

