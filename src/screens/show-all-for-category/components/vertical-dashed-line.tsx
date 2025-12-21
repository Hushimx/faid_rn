import { useAppTheme } from 'common';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Line, LinearGradient, Stop } from 'react-native-svg';

type Props = {
  /** Optional: width of the dashed line */
  width?: number;
};

const VerticalDashedLine = ({ width = 4 }: Props) => {
  const { colors } = useAppTheme();
  const gradientId = `fadeGradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <View style={styles.container}>
      <Svg height="100%" width={width}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={colors.cutomBlack} stopOpacity={1} />
            <Stop offset="100%" stopColor={colors.cutomBlack} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        <Line
          x1={width / 2}
          y1={0}
          x2={width / 2}
          y2="100%" // ✅ fully stretches the SVG vertically
          stroke={`url(#${gradientId})`}
          strokeWidth={0.5}
          strokeDasharray={[4, 6]}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // ✅ this makes the SVG expand with the parent container
    alignItems: 'center',
  },
});

export default VerticalDashedLine;
