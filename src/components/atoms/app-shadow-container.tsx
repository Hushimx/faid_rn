import React, { useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ViewStyle,
  StyleProp,
  Pressable,
  Animated,
} from 'react-native';

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Android elevation (0..24+) */
  elevation?: number;
  /** iOS shadow color */
  shadowColor?: string;
  /** shadow opacity for iOS (0..1) */
  shadowOpacity?: number;
  /** shadow blur radius for iOS */
  shadowRadius?: number;
  /** shadow offset for iOS */
  shadowOffset?: { width: number; height: number };
  /** background color of the container (important for Android elevation) */
  backgroundColor?: string;
  /** border radius */
  borderRadius?: number;
  /** if true, content will be clipped to borderRadius */
  overflowHidden?: boolean;
  /** if true, enables press animation */
  pressable?: boolean;
  /** callback for press events */
  onPress?: () => void;
  /** scale factor for press animation (default: 0.98) */
  pressScale?: number;
  /** animation duration in ms (default: 150) */
  animationDuration?: number;
};

/**
 * Cross-platform Shadow container for React Native
 * - Uses elevation on Android
 * - Uses shadowOffset/shadowRadius/shadowOpacity on iOS
 * - Keeps a clean API for customization
 *
 * Usage example:
 * <AppShadowContainer elevation={6} borderRadius={12} style={{ margin: 16 }}>
 *   <Text>Card content</Text>
 * </AppShadowContainer>
 */

const AppShadowContainer: React.FC<Props> = ({
  children,
  style,
  elevation = 6,
  shadowColor = '#000',
  shadowOpacity = 0.15,
  shadowRadius = 8,
  shadowOffset = { width: 0, height: 4 },
  backgroundColor = '#fff',
  borderRadius = 12,
  overflowHidden = false,
  pressable = false,
  onPress,
  pressScale = 0.98,
  animationDuration = 150,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: pressScale,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start();
  }, [pressScale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start();
  }, []);

  const androidStyle: ViewStyle = {
    elevation,
    backgroundColor,
    borderRadius,
  };

  const iosStyle: ViewStyle = {
    shadowColor,
    shadowOpacity,
    shadowRadius,
    shadowOffset,
    backgroundColor,
    borderRadius,
  };

  const containerStyle = Platform.OS === 'android' ? androidStyle : iosStyle;
  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  const renderContent = () => (
    <Animated.View style={[styles.container, containerStyle, style, animatedStyle]}>
      <View
        style={[
          styles.innerContainer,
          { borderRadius, overflow: overflowHidden ? 'hidden' : 'visible' },
        ]}
      >
        {children}
      </View>
    </Animated.View>
  );

  if (pressable && onPress) {
    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        {renderContent()}
      </Pressable>
    );
  }

  return renderContent();
};

const styles = StyleSheet.create({
  container: {
    // Base container style
  },
  innerContainer: {
    overflow: 'hidden',
  },
});

export default AppShadowContainer;

// --- Quick examples ---
// 1) Simple card
// <AppShadowContainer elevation={8} borderRadius={12} style={{ padding: 16, margin: 12 }}>
//   <Text>Simple card content</Text>
// </AppShadowContainer>

// 2) Clipped content (image with rounded corners)
// <AppShadowContainer elevation={6} borderRadius={14} overflowHidden style={{ width: 200, height: 120 }}>
//   <Image source={{ uri: 'https://...' }} style={{ width: '100%', height: '100%' }} />
// </AppShadowContainer>

// 3) Custom iOS shadow look
// <AppShadowContainer
//   shadowColor="#222"
//   shadowOpacity={0.2}
//   shadowRadius={10}
//   shadowOffset={{ width: 0, height: 6 }}
//   borderRadius={16}
// >
//   <View style={{ padding: 20 }}>
//     <Text>Fancy iOS shadow</Text>
//   </View>
// </AppShadowContainer>
